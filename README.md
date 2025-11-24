# 📁 File Organizer

A utility for automatic file sorting by type. A simple Node.js console application that organizes files into folders based on their extensions.

## ✨ Features

- 🗂️ **Automatic file sorting** by type
- ⚙️ **Customizable rules** via JSON config
- 📁 **Folder selection** for sorting (3 options)
- 👀 **Preview sorting plan** before execution
- ✅ **Action confirmation** before proceeding
- 🛡️ **Automatic folder creation** as needed

## 🚀 Quick Start

### 1. Installation
```bash
# Clone or download the organizer.js file
# Make sure you have Node.js installed
node --version
```

### 2. Run
```bash
node organizer.js
```

## 📋 How to Use

1. **Run the program**: `node organizer.js`
2. **Select folder** for sorting:
   - `1` - Downloads folder (default)
   - `2` - Current folder
   - `3` - Enter custom path
3. **Review the sorting plan**
4. **Confirm action** (y/n)
5. **Watch** automatic file organization

## ⚙️ Configuration

### Configuration File `config.json`

Create `config.json` file in the same folder as `organizer.js`:

```json
{
  "jpg": "Images",
  "jpeg": "Images",
  "png": "Images",
  "pdf": "Documents",
  "doc": "Documents",
  "docx": "Documents",
  "mp4": "Videos",
  "mp3": "Music"
}
```

**Format**: `"extension": "folder_name"`

### If config.json is missing

The program uses default settings:
```javascript
{
  'jpg': 'Images', 'jpeg': 'Images', 'png': 'Images', 'gif': 'Images',
  'pdf': 'Documents', 'doc': 'Documents', 'docx': 'Documents', 'txt': 'Documents',
  'zip': 'Archives', 'rar': 'Archives',
  'mp4': 'Videos', 'mov': 'Videos',
  'mp3': 'Music', 'wav': 'Music'
}
```

## 🎯 Example Workflow

```
📁 SELECT FOLDER FOR SORTING:
1. Downloads folder (default)
2. Current folder
3. Enter custom path

Choose option (1/2/3): 1

📋 SORTING PLAN:
================
📄 photo.jpg → 📁 Images
📄 document.pdf → 📁 Documents
📄 music.mp3 → 📁 Music
📄 unknown.xyz → 📁 Other

Total files: 4

✅ Execute sorting? (y/n): y

🔄 Starting sorting...
Created folder: C:\Users\User\Downloads\Images
Created folder: C:\Users\User\Downloads\Documents
✓ Success: photo.jpg → Images
✓ Success: document.pdf → Documents
✓ Success: music.mp3 → Music
✓ Success: unknown.xyz → Other

🎉 Done! Moved 4 out of 4 files
```

## 🔧 Technical Details

### Supported OS
- ✅ Windows
- ✅ macOS  
- ✅ Linux

### Requirements
- Node.js 12+ 

### Safety Features
- Program only reads/moves files
- Always shows plan before execution
- Requires user confirmation

## 💡 Tips

- **Add new formats** to `config.json`
- **Rename folders** as you prefer
- **Files with unknown extensions** go to `Other` folder
- **Hidden files** (starting with `.`) are ignored

## 🐛 Troubleshooting

**❌ "Folder does not exist"**
- Check path correctness
- Ensure folder exists

**❌ "Settings loaded from file" doesn't appear**
- Ensure `config.json` is in correct folder
- Check JSON syntax

**❌ Files not moving**
- Check folder permissions
- Ensure files aren't used by other programs

## 📝 Future Plans

- [ ] Move log saving for undo functionality
- [ ] File exceptions
- [ ] Sort by date/size
- [ ] Graphical interface

---

**🎉 Enjoy your organized files!**