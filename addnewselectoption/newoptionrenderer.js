const { ipcRenderer } = require('electron')
document.addEventListener('DOMContentLoaded', () => {

   document.getElementById("btn_save").addEventListener('click', async event => {
      event.preventDefault();
      var name = document.getElementById("input_optionname").value.toString();
      var optiontype=document.getElementById("input_optionname").getAttribute("data-optiontype").toString();
      var res = await ipcRenderer.invoke('addnewselectoption', [optiontype,name]);
      alert(res)
      return;
   })

   ipcRenderer.on('send-optiontype', (event, value) => {
      var editor = document.getElementById("input_optionname");
      editor.setAttribute("data-optiontype",value);
   })
});