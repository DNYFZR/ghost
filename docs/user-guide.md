# User Guide

The GH8ST application is a compact Windows IDE, comprising of the following main features :

## App Controls 

On the right side of the screen users have access to the following :

- File navigation ≡ : 

  - See navigation section below

- Terminal </> :

  - See terminal section below

- Clear terminal 🗑️ :

  - Clear the terminal output 

- Render Markdown 📝 :

  - Allows users to toggle rendering of markdown files in the editor window
  
- Settings ⚙️ : 

  - users can change the display font size

  - set the syntax highlighting e.g. ts for typescript / py for python / rust for rust

- File 💾 : 

  - Save the current editor content on the current active path 

  - Save-as by providing a filepath, returning an error message if a file exists at this path or it cannot be accessed. 

  - Delete the current active file from the filesystem

  - When succcessful, each method will confirm the operation, with save options displaying the path content was written to.

- Clear editor 🔄️ : 

  - This button allows users to clear the app & reload 

## Editor Window

When the app is launched, the empty editor is available on the main screen. 

- Users can add any text content to this window and save the file by using the save button on the app menu.

- Users can also load any text file on the hard drive by navigating the file directories via the app menu.
  
  - if a user attempts to open any other type, then an unsupported filetype message is displayed in the editor window. 

  - If the file is particularly large, the editor may take a long time to load, and in some cases the app may crash, but this is relatively rare for general coding files.
  
- Users can toggle markdown file rendering using the notepad icon on the right side of the screen

## File System Navigation

On launch, the  documents directory is set as the current directory. 

- Users can navigate the filesystem via the app menu :

  - Clicking on 📁 icon will move the user into that directory
  
  - Clicking on the back arrow at the top of the menu will move up one level in the file system

  - Clicking on 📄 icon will load that file into the editor window, 

    - If supported, the content is rendered with automatic syntax highlighting, currently determined by file extension 

## Terminal Interface

When the app is launched, the terminal interface is loaded at the bottom of the main app page.

- Users can show / hide the UI (note hiding will reset the terminal at present)

- The terminal can accept any valid PowerShell terminal command, but is not currently configured to handle interactive terminal operations e.g. initialising a python session

## User Information Bar

At the bottom of the app, there is a bar which displays : 

- The full current working directory path

- The currently implemented editor display highlighting

- The current display font size
