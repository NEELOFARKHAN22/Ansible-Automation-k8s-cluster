#!/usr/bin/env python3

import boto3
import json
import argparse
import os

class Ec2Inventory:
    def __init__(self):
        self.inventory = {}
        self.ec2 = boto3.client('ec2', region_name='us-east-1')  # Specify the region you are working with
        self.parse_cli_args()

        if self.args.list:
            self.get_instances()
            print(json.dumps(self.inventory, indent=2))
        elif self.args.host:
            # This script only works for --list, not for --host
            print(json.dumps({}))

    def parse_cli_args(self):
        parser = argparse.ArgumentParser(description='Produce an Ansible Inventory file based on EC2 instances')
        parser.add_argument('--list', action='store_true', default=True, help='List EC2 instances')
        parser.add_argument('--host', action='store', help='Get all information about a specific instance')
        self.args = parser.parse_args()

    def get_instances(self):
        instances = self.ec2.describe_instances(Filters=[{'Name': 'instance-state-name', 'Values': ['running']}])

        k3s_master = []
        k3s_worker = []

        for reservation in instances['Reservations']:
            for instance in reservation['Instances']:
                instance_id = instance['InstanceId']
                public_ip = instance.get('PublicIpAddress')
                private_ip = instance.get('PrivateIpAddress')
                tags = {tag['Key']: tag['Value'] for tag in instance.get('Tags', [])}

                # Identify the instance role based on tags
                if 'Name' in tags and 'k3s-master' in tags['Name']:
                    k3s_master.append({
                        'ansible_host': public_ip,
                        'private_ip': private_ip,
                        'instance_id': instance_id,
                        'tags': tags
                    })
                elif 'Name' in tags and 'k3s-worker' in tags['Name']:
                    k3s_worker.append({
                        'ansible_host': public_ip,
                        'private_ip': private_ip,
                        'instance_id': instance_id,
                        'tags': tags
                    })

        # Build the inventory structure expected by Ansible
        self.inventory = {
            'k3s_master': {
                'hosts': [instance['ansible_host'] for instance in k3s_master],
                'vars': {
                    'ansible_user': 'ubuntu',
                    'ansible_ssh_private_key_file': '/home/ubuntu/ansible.pem',
                },
            },
            'k3s_worker': {
                'hosts': [instance['ansible_host'] for instance in k3s_worker],
                'vars': {
                    'ansible_user': 'ubuntu',
                    'ansible_ssh_private_key_file': '/home/ubuntu/ansible.pem',
                },
            },
            '_meta': {
                'hostvars': {instance['ansible_host']: {
                    'ansible_host': instance['ansible_host'],
                    'private_ip': instance['private_ip'],
                    'instance_id': instance['instance_id'],
                    'tags': instance['tags'],
                } for instance in k3s_master + k3s_worker}
            }
        }

if __name__ == "__main__":
    Ec2Inventory()
