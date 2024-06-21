# Project: Deploy a React Application on Self-Hosted k3s Cluster with Monitoring
## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Tools and Technologies](#tools-and-technologies)
4. [Getting Started](#getting-started)
    - [Launching EC2 Instance](#launching-ec2-instance)
    - [Configuring Your EC2 Instance](#configuring-your-ec2-instance)
    - [Configuring Ansible with Dynamic Inventory for Amazon EC2](#configuring-ansible-with-dynamic-inventory-for-amazon-ec2)
5. [Configuring Ansible](#configuring-ansible)
    - [Install Python 3, pip, and boto3](#install-python-3-pip-and-boto3)
    - [Configuring Ansible Dynamic Inventory with ec2.py](#configuring-ansible-dynamic-inventory-with-ec2py)
6. [Execution Output](#execution-output)
7. [Accessing Grafana and Prometheus](#accessing-grafana-and-prometheus)
8. [Monitoring and Metrics](#monitoring-and-metrics)
## Introduction

This project aims to deploy a React application on a self-hosted Kubernetes cluster using k3s. The setup includes one master node and one slave node, managed and provisioned using Ansible playbooks. Additionally, Prometheus and Grafana will be configured to monitor both the React application and server utilization.

## Project Overview

In this project, we will deploy a React application on a Kubernetes cluster managed by k3s. Kubernetes provides powerful orchestration capabilities, while k3s is a lightweight Kubernetes distribution designed for edge computing and simpler deployments. By leveraging Kubernetes, we can efficiently manage containerized applications like our React frontend.

### Tools and Technologies

| Tool/Technology | Description |
|-----------------|-------------|
| Kubernetes (k3s) | Lightweight Kubernetes distribution for container orchestration. |
| Ansible | Automation tool for provisioning and managing infrastructure. |
| Prometheus | Monitoring and alerting toolkit for gathering metrics from applications and systems. |
| Grafana | Platform for data visualization and monitoring. |
| Python 3 | Programming language used for scripting and automation. |
| pip | Package installer for Python. |
| boto3 | AWS SDK for Python, required for interacting with AWS services. |

## Getting Started

### Launching EC2 Instance

To begin, launch an EC2 instance on AWS with Ubuntu image, t2.medium instance type, and ensure it has a key pair (**`ansible.pem`**) attached for SSH access. Additionally, configure IAM role with full access to EC2 and VPC resources.

#### Step-by-Step Guide:

1. **Log in to AWS Console:**
   - Navigate to the AWS Management Console: [AWS Console](https://aws.amazon.com/console/).

2. **Create IAM Role:**

   - Click on **Services** at the top left corner, and select **IAM** under the **Security, Identity & Compliance** category.
   - In the IAM dashboard, click on **Roles** in the left-hand menu.
   - Click on **Create role**.
   - Choose **AWS service** as the type of trusted entity and select **EC2** under **Use case**.
   - Click **Next: Permissions**.
   - In the **Attach permissions policies** step, search for and select the following policies:
     - **AmazonEC2FullAccess**: Provides full access to all EC2 actions.
     - **AmazonVPCFullAccess**: Provides full access to all VPC actions.
   - Click **Next: Tags** to add any tags if needed, then click **Next: Review**.
   - Give your role a name (e.g., **`EC2_FullAccess_VPC_FullAccess`**) and optionally, add a description.
   - Click **Create role**.

3. **Launch Instance:**
   - Click on **EC2** to enter the EC2 Dashboard.
   - Click **Launch Instance** to start the instance creation wizard.

4. **Choose an Amazon Machine Image (AMI):**
   - Select **Ubuntu** as the operating system for your instance.

5. **Choose an Instance Type:**
   - Select **t2.medium** as the instance type. This ensures sufficient resources for running your Kubernetes cluster and applications.

6. **Configure Instance Details:**
   - Choose the appropriate network settings.
   - Select the IAM role created in the previous step (**`EC2_FullAccess_VPC_FullAccess`**).

7. **Add Storage:**
   - Configure the storage as per your requirements. The default settings are usually sufficient for testing purposes.

8. **Add Tags:**
   - Optionally, add tags to your instance for better organization.

9. **Configure Security Group:**
   - Create a new security group or select an existing one.
   - Open SSH (port 22) from your IP address for secure access.
   - Additionally, open ports like HTTP (80) and HTTPS (443) for web applications, and any other ports required by your specific project needs (e.g., ports for Kubernetes API access, Prometheus metrics).

10. **Review Instance Launch:**
    - Ensure all configurations are correct as per your project requirements.
    - Choose to create a new key pair (**`ansible.pem`**) for SSH access. Download and securely store the private key file (.pem), as it will be needed to access your instance.


11. **Launch Instance:**
    - Click **Launch Instance** and confirm by selecting the key pair.
    - The instance will now be provisioned. You can view its status in the EC2 Dashboard.
      
### Configuring Your EC2 Instance

After launching your EC2 instance, follow these steps to connect to the instance and prepare it for further configuration:

#### Connect to EC2 Instance and Prepare for Configuration

1. **Connect to Your EC2 Instance:**
   - Open your terminal (or use a terminal emulator like PuTTY on Windows).
   - Change directory to where your `ansible.pem` key file is stored (e.g., `cd path/to/your/key`).
   - Set permissions for your key file to ensure it is not publicly viewable: 
     ```
     chmod 400 ansible.pem
     ```
   - Connect to your EC2 instance using SSH (replace `your-instance-ip` with your actual EC2 instance IP address):
     ```
     ssh -i ansible.pem ubuntu@your-instance-ip
     ```
   - If prompted to confirm the connection, type `yes`.

2. **Update and Upgrade System Packages:**
   - Once connected to your EC2 instance via SSH, update the package list and upgrade installed packages to their latest versions:
     ```
     sudo apt update
     sudo apt upgrade -y
     ```
   - This ensures your instance has the latest security updates and package versions.

### Additional Notes

- Ensure you have securely stored your `ansible.pem` key file and do not share it publicly.
- For security best practices, consider disabling SSH password authentication and only allowing SSH access via key pairs.
  
### Configuring Ansible with Dynamic Inventory for Amazon EC2

- After preparing your EC2 instance and updating system packages, follow these steps to configure Ansible with dynamic inventory for managing Amazon EC2 instances:

#### Create a Directory and Install Dynamic Inventory Modules
- After preparing your EC2 instance and updating system packages, follow these steps to configure Ansible with dynamic inventory for managing Amazon EC2 instances:

#### Create a Directory and Install Dynamic Inventory Modules

1. **Create a Directory for Dynamic Inventory:**
   - Log in to your EC2 instance via SSH (if not already logged in).
   - Create a directory named `dynamic_inventory` to store Ansible dynamic inventory modules:
     ```
     mkdir dynamic_inventory
     cd dynamic_inventory
     ```

2. **Download Dynamic Inventory Files:**
   - Download the `ec2.py` dynamic inventory script and `ec2.ini` configuration file from the Ansible GitHub repository:
     ```
     wget https://raw.githubusercontent.com/ansible/ansible/stable-2.9/contrib/inventory/ec2.py
     wget https://raw.githubusercontent.com/ansible/ansible/stable-2.9/contrib/inventory/ec2.ini
     ```

3. **Make Dynamic Inventory Files Executable:**
   - Make both `ec2.py` and `ec2.ini` executable using the `chmod` command:
     ```
     chmod +x ec2.py
     chmod +x ec2.ini
     ```

#### Verify and Use Dynamic Inventory

4. **Verify Dynamic Inventory Setup:**
   - Verify that the dynamic inventory files (`ec2.py` and `ec2.ini`) are in the `dynamic_inventory` directory and have executable permissions:
     ```
     ls -l
     ```

5. **Test Dynamic Inventory:**
   - Test the dynamic inventory setup by listing EC2 instances using Ansible's `ansible-inventory` command:
     ```
     ansible-inventory -i ec2.py --list
     ```
   - This command should output a JSON structure containing details of EC2 instances in your AWS account.
### **Configuring Ansible**

Follow these steps to install and configure Ansible on your EC2 instance:

#### **Install Ansible**

1. **Add Ansible PPA:**
   - To install the latest version of Ansible, first add the Ansible PPA (Personal Package Archive) repository. PPAs are additional software repositories that contain updated versions of software not provided by the official Ubuntu repositories.
     ```bash
     sudo apt-add-repository --yes --update ppa:ansible/ansible
     ```
     - `sudo`: Executes the command with administrative privileges.
     - `apt-add-repository`: Command to add repositories to the system's list of sources.
     - `--yes`: Automatically answers "yes" to prompts, ensuring non-interactive installation.
     - `--update`: Updates the list of available packages after adding the repository.

2. **Update Package List:**
   - After adding the Ansible PPA, update the package list to include the newly added repository.
     ```bash
     sudo apt update
     ```
     - `sudo`: Administrative privileges.
     - `apt update`: Updates the package lists from the repositories to get information on the newest versions of packages and their dependencies.

3. **Install Ansible:**
   - Now, install Ansible using the apt package manager. Ansible will be downloaded and installed along with its dependencies.
     ```bash
     sudo apt install ansible -y
     ```
     - `sudo`: Administrative privileges.
     - `apt install ansible`: Command to install Ansible.
     - `-y`: Assumes "yes" as the answer to all prompts and runs non-interactively.

4. **Verify Installation:**
   - After installation, verify that Ansible has been installed correctly by checking its version.
     ```bash
     ansible --version
     ```
     - `ansible --version`: Command to display the version of Ansible currently installed.
     - This command should output the installed Ansible version, confirming that Ansible has been successfully installed on your EC2 instance.
### Explanation

- **Add Ansible PPA (`sudo apt-add-repository --yes --update ppa:ansible/ansible`):**
  - This command adds the Ansible PPA repository to your system.
  - `sudo`: Provides administrative privileges for executing the command.
  - `apt-add-repository`: Command to add new repositories to the system.
  - `--yes`: Automatically answers "yes" to all prompts during the repository addition process.
  - `--update`: Updates the list of available packages after adding the repository, ensuring the system has the latest package information.

- **Update Package List (`sudo apt update`):**
  - This command updates the package lists from all configured repositories.
  - `sudo`: Administrative privileges.
  - `apt update`: Updates the list of available packages to include any new or updated packages from the repositories.

- **Install Ansible (`sudo apt install ansible -y`):**
  - This command installs Ansible along with its dependencies.
  - `sudo`: Administrative privileges.
  - `apt install ansible`: Installs Ansible using the apt package manager.
  - `-y`: Automatically answers "yes" to any prompts that may appear during the installation process, ensuring a non-interactive installation.

- **Verify Installation (`ansible --version`):**
  - This command verifies the installation of Ansible by displaying the currently installed version.
  - `ansible --version`: Command to check the installed version of Ansible.
  - This output confirms that Ansible has been successfully installed on your EC2 instance, allowing you to proceed with further configuration and automation tasks.

### Configure Ansible Settings

1. **Edit `ansible.cfg` File**

   To configure Ansible settings for your project, follow these steps to edit the `ansible.cfg` file:

   - **Navigate to the Ansible Configuration Directory:**
     ```bash
     cd /etc/ansible
     ```
     This command changes the current directory to where Ansible's global configuration files are stored.

   - **Edit `ansible.cfg` File:**
     ```bash
     sudo nano ansible.cfg
     ```
     Use your preferred text editor (e.g., `nano`, `vim`) with administrative privileges (`sudo`) to open the `ansible.cfg` file.

   - **Add the Following Configurations:**
     ```ini
     [ansible]
     ansible_ssh_private_key_file = /home/ubuntu/ansible.pem
     inventory = /home/ubuntu/dynamic_inventory
     host_key_checking = True
     remote_user = ubuntu
     ask_pass = False
     gather_facts = False

     [inventory]
     enable_plugins = aws_ec2
     ```

     Explanation of Configuration Options:
     - `[ansible]` section:
       - `ansible_ssh_private_key_file`: Specifies the path to the SSH private key file (`ansible.pem`) used for connecting to remote hosts.
       - `inventory`: Defines the path to the inventory file (`dynamic_inventory`) that lists all managed hosts.
       - `host_key_checking`: Ensures SSH host key checking is enabled for secure connections.
       - `remote_user`: Specifies the default username (`ubuntu` in this case) used to connect to remote hosts.
       - `ask_pass`: Disables prompting for passwords during playbook execution (set to `False` for key-based authentication).
       - `gather_facts`: Disables gathering facts from remote hosts by default, useful for environments where fact gathering is unnecessary or costly.

     - `[inventory]` section:
       - `enable_plugins`: Enables dynamic inventory plugins (`aws_ec2` in this case) to automatically populate the inventory based on AWS EC2 instances.

   - **Save and Exit:**
     - After adding these configurations, save the changes and exit the text editor (`Ctrl + X`, then `Y` to confirm, and `Enter` to save).


### **Install Python 3, pip, and boto3**

1. **Install Python 3:**
   - Python 3 is typically pre-installed on Ubuntu. Verify by running:
     ```
     python3 --version
     ```

2. **Install pip:**
   - Ensure pip is installed for managing Python packages:
     ```
     sudo apt install python3-pip -y
     ```

3. **Install boto3:**
   - Use pip to install boto3, the AWS SDK for Python:
     ```
     pip3 install boto3
     ```      
## Configuring Ansible Dynamic Inventory with `ec2.py`

### Overview

Ansible can dynamically manage AWS EC2 instances using a Python script called `ec2.py`, which fetches instance information from AWS and formats it for Ansible. Here's how to configure and customize `ec2.py` for your project.

### Edit `ec2.py` Script

The `ec2.py` script fetches information about running EC2 instances and generates an Ansible inventory dynamically.

1. **Connect to Your EC2 Instance:**
   - Ensure you are connected to your EC2 instance via SSH.

2. **Navigate to the `dynamic_inventory` Directory:**
   - Change directory to where `ec2.py` and `ec2.ini` are located. If you followed previous steps, it should be under `~/dynamic_inventory/`.
     ```bash
     cd ~/dynamic_inventory/
     ```

3. **Edit `ec2.py` Script:**
   - Use a text editor like `nano` or `vi` to edit `ec2.py`.
     ```bash
     nano ec2.py
     ```
     - Replace `nano` with your preferred text editor.
       
 ### `ec2.py` Script

Below is the content of the `ec2.py` script that fetches information about running EC2 instances and generates an Ansible inventory dynamically.

```python
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
```
 ### Prerequisites

Before using the `ec2.py` script, ensure the following prerequisites are met:

- Python 3.x installed on your system.
- Boto3 library installed (`pip install boto3`).
- AWS CLI configured with appropriate IAM credentials.

### Script Explanation

### Script Overview

The `ec2.py` script performs the following tasks:

1. **Initialization**: Sets up necessary configurations and initializes the Boto3 EC2 client.
   
2. **Command-line Arguments**: Parses command-line arguments to determine whether to list all EC2 instances (`--list`) or fetch details of a specific host (`--host`).

3. **Fetching Instances**: Retrieves running EC2 instances from the specified AWS region (`us-east-1` in this example).

4. **Instance Classification**: Classifies instances into `k3s_master` and `k3s_worker` based on their tags (`k3s-master` and `k3s-worker` respectively).

5. **Building Inventory**: Constructs an Ansible-compatible inventory structure:
   - Groups instances under `k3s_master` and `k3s_worker` with their respective public IPs.
   - Assigns SSH credentials (`ubuntu` user and path to `ansible.pem` SSH private key file) to each group.
   - Includes detailed metadata (`private_ip`, `instance_id`, `tags`) under `_meta` for each instance.
     
## **Configure Ansible Dynamic-inventory**

1. **Edit `playbook.yml` File**

   To configure Ansible settings for your project, follow these steps to edit the `playbook.yml` file:

   - **Navigate to the Ansible Configuration Directory:**
     ```bash
     cd /etc/ansible
     ```
     This command changes the current directory to where Ansible's global configuration files are stored.

   - **Edit `playbook.yml` File:**
     ```bash
     sudo nano playbook.yml
     ```
     Use your preferred text editor (e.g., `nano`, `vim`) with administrative privileges (`sudo`) to open the `ansible.cfg` file.

   - **Add the Following Configurations:**
     ```
        - name: Launch EC2 instances and create infrastructure
        # This playbook is named "Launch EC2 instances and create infrastructure."
        # It defines a series of tasks to set up an AWS environment including creating a VPC and launching EC2 instances.
        hosts: localhost
        # The playbook will run locally on the machine executing the script. 
        # It won't connect to any remote hosts initially since infrastructure needs to be set up first.
        gather_facts: False
        # No need to gather facts about the local system because we are just creating resources in AWS, not interacting with the local machine.
      
        tasks:
          - name: Create VPC
            # This task is called "Create VPC."
            # It will set up a Virtual Private Cloud (VPC) in AWS, which is a logically isolated network for our AWS resources.
            amazon.aws.ec2_vpc_net:
              # We use the `ec2_vpc_net` module from Ansible's AWS collection to manage VPCs.
              name: k3s-vpc
              # The VPC will be named "k3s-vpc" for identification purposes.
              cidr_block: 10.0.0.0/16
              # We define the CIDR block for the VPC as "10.0.0.0/16", 
              # which specifies the IP address range that the VPC will use. It allows for 65,536 IP addresses.
              region: us-east-1
              # We specify the region where the VPC will be created, which is "us-east-1" (Northern Virginia).
      
            register: vpc
            # The result of this task, which includes details about the created VPC (like its ID), 
            # will be stored in a variable named `vpc` for later use in the playbook.
      
      
          - name: Create Internet Gateway for VPC
        # Task to create an Internet Gateway for the VPC, allowing internet access.
        amazon.aws.ec2_vpc_igw:
          vpc_id: "{{ vpc.vpc.id }}"
          # Associates the Internet Gateway with the created VPC using its ID.
          region: us-east-1
          # Specifies the AWS region where the gateway will be created.
          state: present
          # Ensures that the Internet Gateway is present (created).
      
        register: igw_info
        # Stores the result of this task, including the Internet Gateway ID, in the variable `igw_info`.
      
      - name: Create subnet
        # Task to create a subnet within the VPC, defining a smaller network range.
        amazon.aws.ec2_vpc_subnet:
          vpc_id: "{{ vpc.vpc.id }}"
          # Associates the subnet with the created VPC using its ID.
          cidr: 10.0.1.0/24
          # Specifies the IP address range for the subnet, allowing 256 addresses.
          az: us-east-1a
          # Places the subnet in a specific availability zone within the region.
          state: present
          # Ensures the subnet is present (created).
          region: us-east-1
          # Specifies the AWS region where the subnet will be created.
          map_public: True
          # Indicates that this subnet is public, allowing external internet access.
          tags:
            Name: vpc-subnet
            # Tags the subnet with the name "vpc-subnet" for identification.
      
        register: subnet
        # Stores the result of this task, including the subnet ID, in the variable `subnet`.
      
      - name: Create VPC Subnet Route Table
        # Task to create a route table for the subnet, defining how network traffic is directed.
        amazon.aws.ec2_vpc_route_table:
          vpc_id: "{{ vpc.vpc.id }}"
          # Associates the route table with the created VPC using its ID.
          region: us-east-1
          # Specifies the AWS region where the route table will be created.
          state: present
          # Ensures the route table is present (created).
          subnets:
            - "{{ subnet.subnet.id }}"
            # Links the subnet to this route table using its ID.
          tags:
            Name: route-table-for-subnet
            # Tags the route table with the name "route-table-for-subnet" for identification.
          routes:
            - dest: 0.0.0.0/0
              # Defines a route to any destination (0.0.0.0/0), meaning all outbound traffic.
              gateway_id: "{{ igw_info.gateway_id }}"
              # Routes traffic through the Internet Gateway using its ID from `igw_info`.
      
      - name: Create security group
        # Task to create a security group, defining allowed network traffic rules.
        amazon.aws.ec2_group:
          name: k3s-sg
          # Names the security group "k3s-sg."
          description: k3s security group
          # Provides a description for the security group.
          vpc_id: "{{ vpc.vpc.id }}"
          # Associates the security group with the created VPC using its ID.
          region: us-east-1
          # Specifies the AWS region where the security group will be created.
          rules:
            - proto: tcp
              # Allows traffic over the TCP protocol.
              ports:
                - 22  # SSH
                # Allows SSH traffic on port 22 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address (0.0.0.0/0).
      
            - proto: tcp
              ports:
                - 80  # HTTP for any web server
                # Allows HTTP traffic on port 80 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address.
      
            - proto: tcp
              ports:
                - 8080  # General application port
                # Allows traffic on port 8080 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address.
      
            - proto: tcp
              ports:
                - 6443  # Kubernetes API server
                # Allows Kubernetes API server traffic on port 6443 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address.
      
            - proto: tcp
              ports:
                - 32000  # Grafana NodePort
                # Allows Grafana traffic on port 32000 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address.
      
            - proto: tcp
              ports:
                - 30090  # Prometheus NodePort
                # Allows Prometheus traffic on port 30090 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address.
      
            - proto: tcp
              ports:
                - 30000  # React App NodePort
                # Allows traffic for the React App on port 30000 from any IP.
              cidr_ip: 0.0.0.0/0
              # Allows connections from any IP address.
      
        register: security_group
        # Stores the result of this task, including the security group ID, in the variable `security_group`.
      
      
         - name: Launch master instance
        # Task to create the master EC2 instance for the K3s cluster.
        amazon.aws.ec2_instance:
          key_name: ansible
          # Specifies the SSH key pair named "ansible" for accessing the instance.
          instance_type: t2.medium
          # Chooses the instance type, "t2.medium", which defines the hardware and performance capacity.
          image_id: ami-0e001c9271cf7f3b9  # Replace with your AMI ID
          # Specifies the Amazon Machine Image (AMI) ID to use for the instance (replace with your actual AMI ID).
          wait: yes
          # Waits until the instance is running and accessible before proceeding.
          count: 1
          # Launches one instance.
          region: us-east-1
          # Specifies the AWS region where the instance will be launched.
          tags:
            Name: k3s-master
            # Tags the instance with the name "k3s-master" for identification.
          vpc_subnet_id: "{{ subnet.subnet.id }}"
          # Places the instance in the specified subnet by its ID.
          security_groups:
            - "{{ security_group.group_id }}"
            # Attaches the previously created security group to the instance, controlling its network access.
      
        register: master_instance
        # Saves the details of the created master instance (like its ID and public IP) in the variable `master_instance`.
      
      - name: Launch worker instance
        # Task to create the worker EC2 instance for the K3s cluster.
        amazon.aws.ec2_instance:
          key_name: ansible
          # Specifies the SSH key pair named "ansible" for accessing the instance.
          instance_type: t3.medium
          # Chooses the instance type, "t3.medium", which defines the hardware and performance capacity.
          image_id: ami-0e001c9271cf7f3b9  # Replace with your AMI ID
          # Specifies the Amazon Machine Image (AMI) ID to use for the instance (replace with your actual AMI ID).
          wait: yes
          # Waits until the instance is running and accessible before proceeding.
          count: 1
          # Launches one instance.
          region: us-east-1
          # Specifies the AWS region where the instance will be launched.
          tags:
            Name: k3s-worker
            # Tags the instance with the name "k3s-worker" for identification.
          vpc_subnet_id: "{{ subnet.subnet.id }}"
          # Places the instance in the specified subnet by its ID.
          security_groups:
            - "{{ security_group.group_id }}"
            # Attaches the previously created security group to the instance, controlling its network access.
      
        register: worker_instance
        # Saves the details of the created worker instance (like its ID and public IP) in the variable `worker_instance`.
      
         - name: Wait for SSH to be available on master instance
        # Ensures the SSH service on the master instance is ready to accept connections.
        wait_for:
          host: "{{ master_instance.instances[0].public_ip_address }}"
          # Checks the master instance using its public IP address.
          port: 22
          # The port for SSH connections.
          timeout: 300
          # Waits for up to 300 seconds for SSH to become available.
          delay: 10
          # Starts checking after an initial delay of 10 seconds.
      
      - name: Wait for SSH to be available on worker instance
        # Ensures the SSH service on the worker instance is ready to accept connections.
        wait_for:
          host: "{{ worker_instance.instances[0].public_ip_address }}"
          # Checks the worker instance using its public IP address.
          port: 22
          # The port for SSH connections.
          timeout: 300
          # Waits for up to 300 seconds for SSH to become available.
          delay: 10
          # Starts checking after an initial delay of 10 seconds.
      
      - name: Add master instance to inventory
        # Adds the master instance to the Ansible inventory for future tasks.
        add_host:
          name: master
          # Assigns the name "master" to this instance in the inventory.
          ansible_host: "{{ master_instance.instances[0].public_ip_address }}"
          # Sets the public IP address of the master instance as its Ansible host.
          ansible_user: ubuntu
          # Specifies the SSH user to use for connecting to the instance.
          ansible_ssh_private_key_file: /home/ubuntu/ansible.pem
          # Provides the path to the private key for SSH authentication.
          groups: k3s_master
          # Adds this instance to the "k3s_master" group for grouping purposes.
      
      - name: Add worker instance to inventory
        # Adds the worker instance to the Ansible inventory for future tasks.
        add_host:
          name: worker
          # Assigns the name "worker" to this instance in the inventory.
          ansible_host: "{{ worker_instance.instances[0].public_ip_address }}"
          # Sets the public IP address of the worker instance as its Ansible host.
          ansible_user: ubuntu
          # Specifies the SSH user to use for connecting to the instance.
          ansible_ssh_private_key_file: /home/ubuntu/ansible.pem
          # Provides the path to the private key for SSH authentication.
          groups: k3s_worker
          # Adds this instance to the "k3s_worker" group for grouping purposes.
      
      
      - name: Set up K3s master
        # This block sets up the K3s Kubernetes master node.
        hosts: k3s_master
        # Targets the hosts in the "k3s_master" group.
        vars:
          ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
          # Disables strict host key checking to avoid SSH connection prompts.
        become: yes
        # Allows tasks to be executed with elevated (sudo) privileges.
        tasks:
          - name: Update apt cache
            # Updates the package index on the master node.
            apt:
              update_cache: yes
              # Refreshes the local package cache.
      
          - name: Install k3s on master
            # Installs the K3s lightweight Kubernetes distribution on the master node.
            shell: curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
            # Runs the K3s installation script.
            args:
              creates: /usr/local/bin/k3s
              # This command only runs if K3s is not already installed.
      
          - name: Get k3s join token
            # Retrieves the token needed for worker nodes to join the K3s cluster.
            shell: cat /var/lib/rancher/k3s/server/node-token
            # Reads the join token from the K3s server's file system.
            register: k3s_token
            # Stores the retrieved token in the 'k3s_token' variable.
      
          - name: Save k3s join token to local
            # Saves the retrieved join token to the local machine for use by worker nodes.
            local_action: copy content="{{ k3s_token.stdout }}" dest=./node-token
            # Copies the token content to a local file named 'node-token'.
      
      - name: Set up K3s worker
        # This block sets up the K3s Kubernetes worker node.
        hosts: k3s_worker
        # Targets the hosts in the "k3s_worker" group.
        become: yes
        # Allows tasks to be executed with elevated (sudo) privileges.
        tasks:
          - name: Copy k3s join token to worker
            # Transfers the join token to the worker node.
            copy:
              src: ./node-token
              # Specifies the local path to the token file.
              dest: /tmp/node-token
              # Defines the destination path on the worker node.
      
          - name: Install k3s on worker
            # Installs K3s on the worker node and joins it to the master.
            shell: curl -sfL https://get.k3s.io | K3S_URL=https://{{ hostvars['master']['ansible_host'] }}:6443 K3S_TOKEN=$(cat /tmp/node-token) sh -
            # Runs the K3s installation script with the master's URL and join token.
      
      - name: Deploy React app on K3s
        # This block handles deploying a React app on the K3s cluster.
        hosts: k3s_master
        # Specifies that this should run on the master node.
        vars:
          react_app_image: "sanjaysaini2000/react-app:latest"
          # Defines the Docker image for the React app.
      
        tasks:
          - name: Create deployment manifest for React app
            # Generates a Kubernetes deployment manifest for the React app.
            copy:
              content: |
                apiVersion: apps/v1
                # API version of the Deployment object.
                kind: Deployment
                # Specifies the kind of Kubernetes resource.
                metadata:
                  name: react-app
                  # Sets the name of the deployment.
                  labels:
                    app: react-app
                    # Labels used to identify the app.
                spec:
                  replicas: 2
                  # Number of app instances to run.
                  selector:
                    matchLabels:
                      app: react-app
                      # Matches pods with this label.
                  template:
                    metadata:
                      labels:
                        app: react-app
                        # Labels for the pods created by the deployment.
                    spec:
                      containers:
                      - name: react-app
                        # Name of the container.
                        image: "{{ react_app_image }}"
                        # Specifies the Docker image to use.
                        ports:
                        - containerPort: 80
                          # Port the container listens on.
                        env:
                        - name: NODE_ENV
                          value: "production"
                          # Sets an environment variable inside the container.
              dest: /tmp/react-app-deployment.yml
              # Path to save the deployment manifest file.
      
          - name: Apply deployment manifest for React app
            # Uses `kubectl` to create or update the deployment in the cluster.
            shell: kubectl apply -f /tmp/react-app-deployment.yml
            args:
              chdir: /tmp/
              # Runs the command from the /tmp/ directory.
      
          - name: Create service manifest for React app
            # Generates a Kubernetes service manifest to expose the React app.
            copy:
              content: |
                apiVersion: v1
                # API version of the Service object.
                kind: Service
                # Specifies the kind of Kubernetes resource.
                metadata:
                  name: react-app-service
                  # Sets the name of the service.
                spec:
                  type: NodePort
                  # Exposes the service on a static port.
                  ports:
                  - port: 80
                    # The port the service listens on.
                    targetPort: 80
                    # The port forwarded to the app's container.
                    nodePort: 30000
                    # Static port on the node to access the service.
                  selector:
                    app: react-app
                    # Selects pods with this label.
              dest: /tmp/react-app-service.yml
              # Path to save the service manifest file.
      
          - name: Apply service manifest for React app
            # Uses `kubectl` to create or update the service in the cluster.
            shell: kubectl apply -f /tmp/react-app-service.yml
            args:
              chdir: /tmp/
              # Runs the command from the /tmp/ directory.
      
      - name: Deploy Prometheus and Grafana using Helm
        # This section sets up Prometheus and Grafana on the K3s cluster using Helm.
        hosts: k3s_master
        # Specifies that these tasks run on the master node.
        become: yes
        # Executes tasks with elevated privileges.
      
        tasks:
          - name: Disable UFW (Uncomplicated Firewall)
            # Disables the firewall to ensure no network issues during setup.
            shell: |
              sudo ufw disable || true
              # Disables UFW; if already disabled, ignores errors.
      
          - name: Install Helm if not already installed
            # Checks if Helm is installed, and installs it if not.
            shell: |
              if ! command -v helm &> /dev/null; then
                curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
                # Downloads and installs Helm v3.
              fi
      
          - name: Add Helm repo and update
            # Adds Helm repositories for Prometheus and Grafana, then updates the repo list.
            shell: |
              helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
              # Adds the Prometheus community chart repo.
              helm repo add grafana https://grafana.github.io/helm-charts
              # Adds the Grafana chart repo.
              helm repo update
              # Updates Helm repo information.
      
          - name: Create namespace for monitoring
            # Creates a Kubernetes namespace named 'monitoring'.
            shell: kubectl create namespace monitoring || true
            # If the namespace already exists, the error is ignored.
      
          - name: Install Prometheus using Helm
            # Installs Prometheus in the 'monitoring' namespace using Helm.
            shell: |
              export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
              # Sets the KUBECONFIG to use K3s config.
              helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --wait --timeout 10m
              # Deploys Prometheus using the Helm chart, waits for it to be ready.
      
          - name: Install Grafana using Helm with increased timeout
        # Task name describing the action: Installing Grafana via Helm with extended timeout.
        shell: |
          export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
          helm install grafana grafana/grafana --namespace monitoring --set adminPassword=admin --timeout 10m --wait
          # Shell command to set KUBECONFIG environment variable and install Grafana using Helm.
          # - `export KUBECONFIG`: Sets the Kubernetes configuration file path.
          # - `helm install grafana ...`: Installs Grafana in the 'monitoring' namespace with a specific admin password and timeout.
      
      - name: Patch Prometheus service to NodePort
        # Task name: Changing Prometheus service type to NodePort for external access.
        shell: |
          kubectl patch svc prometheus-kube-prometheus-prometheus -n monitoring -p '{"spec": {"type": "NodePort", "ports": [{"port": 9090, "targetPort": 9090, "nodePort": 30090}]}}'
          # Shell command to patch Prometheus service to NodePort for external access on port 30090.
          # - `kubectl patch svc`: Kubernetes command to patch (modify) a service.
          # - `-p '{"spec": ...}'`: Specifies the JSON payload for the patch operation.
      
      - name: Patch Grafana service to NodePort
        # Task name: Changing Grafana service type to NodePort for external access.
        shell: |
          kubectl patch svc grafana -n monitoring -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 3000, "nodePort": 32000}]}}'
          # Shell command to patch Grafana service to NodePort for external access on port 32000.
          # - `kubectl patch svc`: Kubernetes command to patch (modify) a service.
          # - `-p '{"spec": ...}'`: Specifies the JSON payload for the patch operation.
      
      - name: Check Prometheus Pods status
        # Task name: Checking status of Prometheus pods.
        shell: kubectl get pods -n monitoring -l app.kubernetes.io/name=kube-prometheus-stack -o jsonpath='{.items[*].status.phase}'
        register: prometheus_pod_status
        # Shell command to retrieve Prometheus pod status and register it as a variable.
        # - `kubectl get pods`: Kubernetes command to list pods.
        # - `-n monitoring`: Specifies the namespace 'monitoring'.
        # - `-l app.kubernetes.io/name=kube-prometheus-stack`: Labels to filter pods by.
        # - `-o jsonpath='{.items[*].status.phase}'`: Formats output using JSONPath to get pod phase (e.g., Running).
      
      - name: Print Prometheus Pods status
        # Task name: Printing Prometheus pod status.
        debug:
          msg: "Prometheus Pods status: {{ prometheus_pod_status.stdout }}"
        # Debug module to print the status of Prometheus pods.
        # - `msg`: Message to display.
        # - `prometheus_pod_status.stdout`: Accesses the stdout from the previous task's output.
      
      - name: Get detailed status of Prometheus pods
        # Task name: Retrieving detailed information about Prometheus pods.
        shell: kubectl get pods -n monitoring -l app.kubernetes.io/name=kube-prometheus-stack -o wide
        register: prometheus_pods_detail
        # Shell command to list Prometheus pods with wide output format and register the result.
        # - `-o wide`: Outputs additional information such as node name and IP address.
      
      - name: Print detailed status of Prometheus pods
        # Task name: Printing detailed information about Prometheus pods.
        debug:
          msg: "{{ prometheus_pods_detail.stdout_lines }}"
        # Debug module to print the detailed status of Prometheus pods.
        # - `msg`: Message to display.
        # - `prometheus_pods_detail.stdout_lines`: Accesses the stdout lines from the previous task's output.
      
      - name: Get Prometheus pod logs (if any pod is not running)
        # Task name: Retrieving logs from Prometheus pods if any are not running.
        shell: kubectl logs -n monitoring -l app.kubernetes.io/name=kube-prometheus-stack --tail=100
        register: prometheus_pods_logs
        when: "'Running' not in prometheus_pod_status.stdout"
        # Shell command to retrieve logs from Prometheus pods based on conditions, registers the result if the condition is met.
        # - `kubectl logs`: Retrieves logs from pods.
        # - `--tail=100`: Retrieves last 100 lines of logs.
        # - `when`: Conditional execution based on the previous task's output.
      
      - name: Print Prometheus pod logs
        # Task name: Printing Prometheus pod logs.
        debug:
          msg: "{{ prometheus_pods_logs.stdout_lines }}"
        when: "'Running' not in prometheus_pod_status.stdout"
        # Debug module to print Prometheus pod logs if the pods are not running.
        # - `msg`: Message to display.
        # - `prometheus_pods_logs.stdout_lines`: Accesses the stdout lines from the previous task's output.
      
      - name: Get events in monitoring namespace
        # Task name: Retrieving events from the 'monitoring' namespace.
        shell: kubectl get events -n monitoring --sort-by='.lastTimestamp'
        register: monitoring_namespace_events
        # Shell command to retrieve events from the 'monitoring' namespace and register the result.
        # - `--sort-by='.lastTimestamp'`: Sorts events by their last timestamp.
      
      - name: Print events in monitoring namespace
        # Task name: Printing events from the 'monitoring' namespace.
        debug:
          msg: "{{ monitoring_namespace_events.stdout_lines }}"
        # Debug module to print events from the 'monitoring' namespace.
        # - `msg`: Message to display.
        # - `monitoring_namespace_events.stdout_lines`: Accesses the stdout lines from the previous task's output.
      
      - name: Verify Grafana Pods are running
        # Task name: Checking status of Grafana pods.
        shell: kubectl get pods -n monitoring -l app.kubernetes.io/name=grafana -o jsonpath='{.items[*].status.phase}'
        register: grafana_pod_status
        # Shell command to retrieve Grafana pod status and register it as a variable.
        # - `kubectl get pods`: Kubernetes command to list pods.
        # - `-n monitoring`: Specifies the namespace 'monitoring'.
        # - `-l app.kubernetes.io/name=grafana`: Labels to filter pods by.
      
      - name: Print Grafana Pods status
        # Task name: Printing Grafana pod status.
        debug:
          msg: "Grafana Pods status: {{ grafana_pod_status.stdout }}"
        # Debug module to print the status of Grafana pods.
        # - `msg`: Message to display.
        # - `grafana_pod_status.stdout`: Accesses the stdout from the previous task's output.
      
      - name: Get Grafana admin password
        # Task name: Retrieving Grafana admin password from Kubernetes secret.
        shell: kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode
        register: grafana_admin_password
        # Shell command to retrieve and decode the Grafana admin password from a Kubernetes secret.
        # - `-o jsonpath="{.data.admin-password}"`: Extracts the admin password field from the secret in JSON format.
        # - `| base64 --decode`: Decodes the Base64-encoded password.
      
      - name: Print Grafana admin password
        # Task name: Printing Grafana admin password.
        debug:
          msg: "Grafana admin password is: {{ grafana_admin_password.stdout }}"
        # Debug module to print the Grafana admin password.
        # - `msg`: Message to display.
        # - `grafana_admin_password.stdout`: Accesses the decoded admin password from the previous task's output.
      
      - name: Get Grafana service NodePort
        # Task name: Retrieving NodePort for Grafana service.
        shell: kubectl get svc -n monitoring grafana -o jsonpath='{.spec.ports[0].nodePort}'
        register: grafana_node_port
        # Shell command to retrieve the NodePort where Grafana service is exposed and register the result.
        # - `kubectl get svc`: Retrieves service details.
        # - `-n monitoring`: Specifies the namespace 'monitoring'.
        # - `grafana -o jsonpath='{.spec.ports[0].nodePort}'`: Uses JSONPath to extract the NodePort value.
      
      - name: Print Grafana access information
        # Task name: Printing access information for Grafana.
        debug:
             msg: "Grafana is accessible at: http://{{ ansible_host }}:{{ grafana_node_port.stdout }} with username 'admin' and password '{{ grafana_admin_password.stdout }}'"
           # Debug module to print the URL and login details for accessing Grafana.
           # - `msg`: Message to display.
           # - `ansible_host`: Hostname where Ansible is running.
           # - `grafana_node_port.stdout`: Accesses the NodePort value from the previous task's output.
           # - `grafana_admin_password.stdout`: Accesses the Grafana admin password from the previous task's output.
     ```
### **Run below command to execute the inventory-**
```
ansible-playbook playbook.yml
```
## Execution Output

After executing the Ansible playbook (`playbook.yml`), the following tasks were completed successfully:

1. **Infrastructure Setup:**
   - Created VPC, Internet Gateway, subnet, route table, and security group.
   - Launched EC2 instances for Kubernetes master and worker nodes.

2. **K3s Installation:**
   - Installed K3s on the master and worker instances.

3. **Kubernetes Configuration:**
   - Added master and worker nodes to Ansible inventory.

4. **Deployment of Applications:**
   - Deployed a React application with a NodePort service.
   - Installed Prometheus using Helm with a NodePort service.

5. **Installation of Grafana:**
   - Installed Grafana using Helm with a NodePort service and set admin password.

6. **Service Access Details:**
   - Grafana is accessible at: `http://INSTANCE_PUBLIC_IP:32000` with username `admin` and configured password.
   - Prometheus is accessible at: `http://INSTANCE_PUBLIC_IP:30090`.

## Accessing Grafana and Prometheus

To access Grafana and Prometheus:

- **Grafana Access:**
  - Open a web browser and navigate to `http://INSTANCE_PUBLIC_IP:32000`.
  - Log in with username `admin` and the password set during installation.

- **Prometheus Access:**
  - Open a web browser and navigate to `http://INSTANCE_PUBLIC_IP:30090`.

## Monitoring and Metrics

- **Grafana:**
  - Use Grafana to visualize and monitor metrics collected by Prometheus.
  - Explore dashboards and configure monitoring for Kubernetes and applications.

- **Prometheus:**
  - Collects metrics from Kubernetes components and applications.
  - Use Prometheus queries to monitor and analyze metrics data.
