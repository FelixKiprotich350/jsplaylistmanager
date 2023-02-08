const { ipcRenderer } = require('electron')
document.addEventListener('DOMContentLoaded', () => {

   document.getElementById("btn_save").addEventListener('click', async event => {
      event.preventDefault();
      var name = document.getElementById("input_playlistname").value.toString();
      var id = document.getElementById("input_playlistname").getAttribute("data-playlistid").toString();
      var res = await ipcRenderer.invoke('renameplaylist', [id,name]);
       if(res=="true"){
         alert("Playlist renamed")
       }
      return;
      
   })

   ipcRenderer.on('rename-current-playlist', (event, value) => {
      var editor = document.getElementById("input_playlistname");
      editor.value = value[0].name;
      editor.setAttribute("data-playlistid",value[0].id);

   })
});