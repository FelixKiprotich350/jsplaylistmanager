const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('countfiles'),
  getallplaylists:()=>ipcRenderer.invoke('getallplaylists'),
  getplaylists_tracks:(arg)=>ipcRenderer.invoke('getplaylists_tracks',arg),
  readtags:()=>ipcRenderer.invoke('readtags'),
  EditTrack:(trackpath)=>ipcRenderer.invoke('EditTrack',trackpath), 
})
 
