const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");
const mm = require("music-metadata");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Beat Sync", 
    backgroundColor: "#0f0f0f", 
    autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "src", "assets", "logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), 
      contextIsolation: true,  
      nodeIntegration: false,  
      webSecurity: false  
    }
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
}

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]  
  });

  if (result.canceled) return []; 

  const folderPath = result.filePaths[0]; 
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".mp3"));  

  const songsWithMetadata = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(folderPath, file);  
      const fileUrl = pathToFileURL(fullPath).href; 
      
      try {
        const metadata = await mm.parseFile(fullPath);  
        let albumArt = null;
        
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const pic = metadata.common.picture[0];
          
          // CRITICAL FIX: Explicitly wrap the data in Buffer.from() 
          // to ensure .toString('base64') generates a valid string, 
          // not a list of numbers.
          const base64String = Buffer.from(pic.data).toString('base64');
          
          albumArt = `data:${pic.format};base64,${base64String}`;  
        }

        return {
          url: fileUrl,
          title: metadata.common.title || file.replace(".mp3", ""),  
          artist: metadata.common.artist || "Unknown Artist", 
          album: metadata.common.album || "Unknown Album",
          duration: metadata.format.duration || 0,
          albumArt: albumArt 
        };
      } catch (e) {
        return { 
          url: fileUrl, 
          title: file.replace(".mp3", ""), 
          artist: "Unknown Artist", 
          albumArt: null 
        };
      }
    })
  );

  return songsWithMetadata;
});

app.whenReady().then(createWindow); 
