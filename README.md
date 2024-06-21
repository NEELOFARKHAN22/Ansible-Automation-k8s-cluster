# Project: Deploy a React Application on Self-Hosted k3s Cluster with Monitoring

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
