# Mint Install Guide
written by @LGBTQueen#3381 (♂LGBTrap♀)

## Preface
This Guide is not complete. If you wish to see content in here that is not yet present, send a direct message to @LGBTQueen#3381 .
Also, some of the statements in this guide may be subject to change in the future, e.g. the addition of a new Desktop Environment.

## 1. Introduction
If you wish to install Linux Mint onto your computer, this guide will help you with that.
	
Linux Mint is distributed in 3 Desktop Environments, _Cinnamon_, _MATE_ and _XFCE_.

In the End, what you install comes down to personal preference, but it must be noted that they have different levels of CPU and memory demand. Generally, _Cinnamon_ takes more than _MATE_ takes more than _XFCE_.

So, for example, a notebook with older hardware might be able to __run__ Linux Mint _Cinnamon_, but that's it.
As a personal note, I prefer _MATE_ as a desktop environment over _Cinnamon_ and _XFCE_, but it is up to your liking what to install.

The Desktop Environments can also be modded to change their look (_Addendum A: Desktop Customization_)

### 1.1: The 2 Versions
Linux Mint is not only distributed in 3 Desktop Environments, but also in 2 Versions: Linux Mint and LMDE.

LMDE stands for _Linux Mint Debian Edition_. It is currently (October 11th) only available in the _Cinnamon_ Desktop Environment. 
I will, however, concentrate on the regular Linux Mint, due to it being the most popular.

This Guide might also be applicable to LMDE to some extent.

## 2. Downloading Linux Mint
If you've now decided on the Desktop Environment, the next thing to check is whether you're running a 32-bit or 64-bit system.

Linux Mint is only available for x86 or amd64 systems, meaning you will not be able to install it on an Apple Computer using PowerPC as an architecture, or a Raspberry Pi for example.

If you do not know what architecture you are running, you can easily find out.

### > 2.1: Finding out your Architecture (Linux)
Open a terminal and enter `uname -m`.

* If the output is `x86_64`, your system is running on 64-bits.

* If the output is `i686`, your system is running on 32-bits.

### > 2.1:.1: Finding out your Architecture (Windows)
1. Open the _Windows Control Panel_.

2. Go to _System and Security_.

3. Choose _System_.

4. Find the _System_ area, located under the Windows logo.

You should see either `x86-based processor` or `x64-based processor`.

* `x86` means your processor is running on 32-bits.

* `x64` means your processor is running on 64-bits.

### > 2.1.2: Finding out your Architecture (MacOS)

I do not own an Apple product, so I am not able to test this. But I assume that entering `uname -m` into a terminal will work as well.

Anyone with an Apple product is encouraged to try it out and tell me the result.

### > 2.3: Finding out your mirror
Now that you know your architecture, click on the appropriate link.

You will be brought to a Download Section where you will find the Information about your selected edition. Now you can torrent the .iso file by clicking on _Torrent_. You can also download the file via HTTP.

When downloading over HTTP, just select a link of your country and the next city to you to ensure fast download speed.

For example, someone who lives in Warsaw, Poland, will get fast download speed by selecting the server of the _University of Warsaw_.

However, the download cannot proceed faster than the speed of your connection. So, with some images being close to 2GB in size, the download might take some time even if you selected the closest server.

### > 2.4 Verifying the file
After you've downloaded the file, click on [_verify your ISO_](https://linuxmint.com/verify.php) and select your version (in my case _19.2_).

You will be linked to two files, one called sha256sum.txt and one called sha256sum.txt.gpg

Assuming you are running on Linux, just follow the instructions on the page.

If you are running on Windows, see the forum thread about [_verifying on Windows_](https://forums.linuxmint.com/viewtopic.php?f=42&t=291093).

Otherwise, if you accept the risk, you may as well skip the verifying process and live with the fear of your computer being contaminated.

## 3 Making a bootable Medium
Basically, you have 2 Options:

1. Flash a bootable USB drive

2. Burn a DVD

### 3.1: Making a bootable Medium: Linux
If you are already running Linux, you can use Etcher for USB flashing and Brasero (or another burning software) for DVD burning.

### 3.1.1: Making a bootable Medium: Windows
If you are using Windows, you can use Etcher for USB flashing and the Windows Explorer for DVD burning.
The Etcher process is pretty straight-forward. Once you've downloaded and ran Etcher, it shows you everything you need to do in order to create a bootable USB flash medium on both Windows and Linux

### 3.2: Booting the Medium

### 3.2.1: > Booting from USB
Depending on your BIOS configuration, the Boot Priority might prioritize your Hard Drive or DVD drive over the USB drive. In that case you're going to have to enter your Boot Menu. On most computers it is entered by pressing a key like F12 on Boot, however, depending on your model, this might differ.
If everything goes right, your computer should boot into the Linux Mint Selection Screen now.

### 3.2.2: > Booting from CD
Many computers have the CD drive set to boot before their hard drive or USB drives. If that is not the case, you will need to enter your Boot Menu as already written in _3.2.1: > Booting from USB_.
If everything goes right, your computer should boot into the Linux Mint Selection Screen now.

## 4 Proceeding with the installation

### 4.1: Booting into the Live system
Select _Start Linux Mint_ and wait until you have booted to the desktop.
From there, you can either try the system you will be installing soon, or install it now.

### 4.2: Installing Linux Mint
If you've decided to install Linux Mint, just click on the "Install Linux Mint" icon on your desktop.

### > 4.2.1: Language & Keyboard Settings
The install window will open, prompting for your language of choice. Please note that I will only go through this process in the English language. After you've chosen your language, click on _Continue_ (or the equivalent for that in your language).

After that, you will be prompted to enter your keyboard layout. Note that the keyboard layout does not need to be the same as the language you entered, as those settings are independent.

Under each Language you will find different settings, for example QWERT* or DVORAK versions. You can use the bar under the two select boxes to test out the layout, e.g. by typing every key and matching them with your keyboard key labels.

### > 4.2.2: Third-party software
After confirming your Language & Keyboard Preferences, Linux Mint will ask you whether you'd like to install Third-party software like Wi-Fi drivers, programs MP3 files, etc. Generally, unless you have a reason not to check this box, you will want to check it.

### > 4.2.3: Installation type
If you've already got a system installed, Linux Mint will detect it and ask you if you want to install Linux Mint alongside of said system.

Doing this will __not__ change the already installed system in any way except for the fact that it will have less disk space to use, as that's used to install Linux Mint.

If you select this option, you will be brought to a screen where you can appoint how much disk space should be allocated to the new installation.

If you, however, want to have Linux Mint as a standalone system, you can select _Erase disk and install Linux Mint_. Doing this will __delete all the files on your hard drive__ and install Linux Mint on it's place. You should only do this if working with a new hard drive or if you really want to replace your old system.

Both of these options also support _LVM_ and _Encryption_.

_LVM_ will allow you to create snapshots and roll back to them in case of a system emergency, alongside other things. _Encryption_ will, well... encrypt. It will encrypt your partition and only decrypt with a password.

If you want something entirely different, you can choose _Something else_ and arrange the partition table to your heart's content.

If you're done, you can click on _Continue_.

### > 4.2.4 Time Zone & User Profile
You will be asked for your time zone, this is pretty straightforward. Just enter your time zone.

Next Linux Mint will want you to provide the basic user information: Your Name, the Username, your computer's name and Password.

Your username is the lowercase and english alphabet version of your name.

Your computer name is composed of your username and your computer model. It is used for example in networking, and does not need to be changed usually.

I will not prescribe you how to choose your password. You should be intelligent enough to generate a secure password by yourself.

Then you can check whether you want to be logged in automatically or if you'd like to have a login screen.

If you've selected _Require my password to log in_, you can also choose _Encrypt my home folder_, which encrypts your home folder.

This is useful for a computer with multiple users. It will protect your data from being viewed from other users.

### 4.3: The install screen
The install screen features a progress bar, a skip button for skipping optional tasks (Note: Every task has a reason for it existing, so skipping an action may cause problems afterwards!) and a big info area.

The info area shows off the features Linux Mint offers. Also it is nice reading material for the long install time you will now have to wait through.

Above the progress bar it is said what installation action is done, and if you click on the arrow left to the text you will also see a more verbose description of what is happening.

## 5. Congratulations
Congratulations! Linux Mint is now installed! You can either restart or continue using the system.
Note that any changes you make on the system will not be saved when you reboot, since you are still on the medium you flashed on the USB or burned on the DVD.

If you want to make permanent changes to your system now, reboot first.

## ADDENDA

### Addendum A: Desktop Customization
`coming soon`
