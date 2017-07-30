# Pegg PhoneGap App

## Usage

### New Production Build

```
bin/clean
git reset HEAD
git co .
nvm use v5.10.1
bin/configure -e production -p ios
phonegap build ios
```

### Install on device Android
```
phonegap install android --device --verbose
```

### Production build XCode settings

# General
Version -> 1.1.8
Build -> 1.1.8
Team -> Augustin
Deploy Target -> 9.0
Devices -> iPhone
Device Orientation -> Portrait

# Capabilites
Push Notifcations -> On

# Build Settings
Signing -> Code Signing Identities -> iOS Developer


# Plugin Submodules
We're using git submodules to preserve local checkouts of our modules. To add a new plugin to the project, use:

    git submodule add <repo> vendor/<phonegap-plugin-name>

and then add a line to the `configure` script to instruct phonegap to use the plugin.
