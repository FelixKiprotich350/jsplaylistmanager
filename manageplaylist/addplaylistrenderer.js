const { ipcRenderer } = require('electron')
document.addEventListener('DOMContentLoaded', () => {

   document.getElementById("btn_save").addEventListener('click', async event => {
      event.preventDefault();
      var name = document.getElementById("input_playlistname").value.toString();
      if (name == null | name == "") {
         event.preventDefault();
         event.stopPropagation();
        
        ipcRenderer.invoke('showMessageBox',"Enter the name of playlist");
         return;
      }
      var res = await ipcRenderer.invoke('addnewplaylist', name);

      return;
   })

});