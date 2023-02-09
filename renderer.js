const { ipcRenderer, electron, ipcMain } = require('electron')
var mypath = "E:\\xMedia\\Music\\";
var current_rows = null;
document.addEventListener('readystatechange', (event) => {
   // alert("ok");
   if (document.readyState.toString().toLowerCase() == "complete") {
      //alert("i am ready");
      try {
         document.getElementById("btn_myfavourites").addEventListener("click", function (event) {
            
            getfavtracks(this);
         });
         document.getElementById("btn_addplaylist").addEventListener("click", function (event) {
            addnewplaylist()
         });
         document.getElementById("btn_allfiles").addEventListener("click", function (event) {
            getalltracks(this)
         });
         var def_playlist = document.getElementById("btn_defaultplaylist");
         def_playlist.addEventListener('click', function (ev) {
            playlistclicked(this);
         });
         def_playlist.addEventListener('contextmenu', async (e) => {
            e.preventDefault()
            await ipcRenderer.send('show_playlist_contextmenu', "0")

         })
         //drag and drop events
         //table
         document.getElementById("myTable").addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", event.target.innerHTML);
         });
         document.getElementById("myTable").addEventListener("dragover", function (event) {
            event.preventDefault();
         });
         document.getElementById("myTable").addEventListener("drop", (event) => {

            event.preventDefault();

            addnewtracksonplaylist(event.dataTransfer.files)
         });
         //parent div
         document.getElementById("mytablediv").addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", event.target.innerHTML);
         });
         document.getElementById("mytablediv").addEventListener("dragover", function (event) {
            event.preventDefault();
         });
         document.getElementById("mytablediv").addEventListener("drop", (event) => {

            event.preventDefault();
            event.stopPropagation();

            addnewtracksonplaylist(event.dataTransfer.files)
         });
         document.getElementById("input_searchbox").addEventListener('keyup', async (event) => {
            try {
               var trelements = document.querySelectorAll("#tableBody tr");
               var searchkey = document.getElementById("input_searchbox").value;
               trelements.forEach(row => {
                  if (row.innerText.toLowerCase().includes(searchkey.toLowerCase())) {
                     row.removeAttribute("hidden")
                  }
                  else {
                     row.setAttribute("hidden", "")
                  }
               });
            }
            catch (err) {
               ipcRenderer.invoke("showMessageBox", err.message)
            }
         });
         //get all playlists
         getAllPlaylists();
         // playlistclicked(def_playlist)
      }
      catch (err) {
         ipcRenderer.invoke("showMessageBox", err.message)
      }
   }
   else {
      //alert("not ready");
   }
});
ipcRenderer.on('newplaylistadded', async (event, arg) => {
   try {
      displayplaylists(arg);
   }
   catch (error) {
      ipcRenderer.invoke('showMessageBox', error)
   }
})
ipcRenderer.on('onplaylistdeleted', async (event, arg) => {
   try {
      // Get the table body element in which you want to add row
      let myul = document.getElementById("sidebar_playlist");
      const playlists = document.querySelectorAll('li[data-playlistid="' + arg.id.toString() + '"]');
      if (playlists.length > 0) {
         playlists[0].remove();
      }
   }
   catch (error) {
      ipcRenderer.invoke('showMessageBox', error)
   }
})
async function getfavtracks(element) {
   try {
       markactiveplaylist(element)
      var tracks = await ipcRenderer.invoke('getfavouritetracks');
      if (tracks != "errror") {
         tracks.forEach(element => {
            addTracktoTable(element)
         });
      }
      else {
         alert("Error occured while getting the tracks!")
      }
   } catch (error) {
      alert(err)
   }
}
async function getalltracks(element) {
   try {
       markactiveplaylist(element)
      var tracks = await ipcRenderer.invoke('getalltracks');
      if (tracks != "error") {
         tracks.forEach(element => {
            addTracktoTable(element)
         });
      }
      else {
         alert("Error occured while getting the tracks!")
      }
   } catch (error) {
      alert(err)
   }
}
async function addnewtracksonplaylist(files) {
   try {
      var mfiles = []
      for (const f of files) {
         mfiles.push(f.path);
      }
      var play_id = document.getElementById("myTable").getAttribute("data-playlistid")
      var play_id2 = document.getElementById("mytablediv").getAttribute("data-playlistid")

      if (play_id == "" | play_id == null | play_id != play_id2) {
         alert("You have not selected a playlist!\n The tracks will be added to the default playlist!");
         play_id = "0";
         return;
      } 
      var args = { playlistid: play_id, tracks: mfiles }
      var result = await ipcRenderer.invoke('addtrackstoplaylist', args);
      if (result) {
         alert("Tracks added Successfully!")
      }
      else {
         alert("Error occured while adding the tracks. Process terminated!")
      }
   } catch (error) {
      alert(error)
   }
}
async function addnewplaylist() {
   try {
      await ipcRenderer.invoke('showaddplaylistwindow')
   }
   catch (error) {
      alert(error);
   }
}
function getAllPlaylists() {
   try {
      ipcRenderer.invoke('getallplaylists')
         .then(function (result) {
            var res = result;
            let myul = document.getElementById("sidebar_playlist");
            while (myul.firstChild) {
               myul.removeChild(myul.firstChild);
            }
            res.forEach(i => {
               displayplaylists(i);
            });
         })
         .catch((error) => {
            alert(error);
         });

   } catch (error) {
      alert(error.message);
   }
}
function displayplaylists(playlistitem) {
   try {
      // Get the table body element in which you want to add row
      let myul = document.getElementById("sidebar_playlist");

      // Create row element
      let row = document.createElement("li");
      let row_link = document.createElement("a");
      //let row_link_i = document.createElement("i");
      //row_link_i.classList.add("icon-music");
      row_link.setAttribute("href", "#");
      row_link.innerHTML = `<i class="icon-music"></i> ${playlistitem.name}`;
      row.appendChild(row_link);
      row.setAttribute("data-playlistid", playlistitem.id);
      row.addEventListener('click', function (ev) {
         playlistclicked(this);
      });
      row.addEventListener('contextmenu', async (e) => {
         e.preventDefault()
         await ipcRenderer.send('show_playlist_contextmenu', playlistitem.id)

      })
      myul.appendChild(row);
   }
   catch (error) {
      alert(error.message)
   }
}
async function playlistclicked(element) {
   try {
      //get playlistid
      var pl_id = element.getAttribute("data-playlistid");

      let mytable = document.getElementById("myTable");
      let mytablediv = document.getElementById("mytablediv");
      markactiveplaylist(element)
     /*  var liElements = document.querySelectorAll("#sidebar_playlist li");
      liElements.forEach(i => {
         //remove the active element
         i.classList.remove("active");
      })
      //remove default playlist active attribute
      let defplaylist = document.getElementById("btn_defaultplaylist");
      defplaylist.classList.remove("active");
      //make the clicked item active
      element.classList.add("active");
      var x = await ClearTracksontable();
      if (!x) {
         return;
      }
      //stop playingitem
      let player = document.getElementById("myAudioPlayer").setAttribute("src", "");
      let playertitle = document.getElementById("trackmarquee");
      playertitle.innerText = "";
 */
      //set playlist id
      mytable.setAttribute("data-playlistid", pl_id)
      mytablediv.setAttribute("data-playlistid", pl_id)
      //retrieve tracks for the above playlistid
      ipcRenderer.invoke('getplaylists_tracks', pl_id)
         .then(function (result) {
            var tracks = result;
            tracks.forEach(async track => {
               await addTracktoTable(track);
            });

         })
         .catch((error) => {
            alert(error);
         });
   }
   catch (error) {
      alert(error.message);
   }
}
async function addTracktoTable(track) {
   try {
      // Get the table body element in which you want to add row
      let table = document.getElementById("tableBody");
      let myTable = document.getElementById("myTable");
      // Create row element
      let row = document.createElement("tr")
      // Create cells 
      let c2 = document.createElement("td")
      let c3 = document.createElement("td")
      let c4 = document.createElement("td")
      let c5 = document.createElement("td")
      let c6 = document.createElement("td")
      let Likecolumn = document.createElement("td");
      let Pincolumn = document.createElement("td");
      //like
      let likeimg = document.createElement("img");
      likeimg.style.width = "20px";
      likeimg.style.height = "20px";
      likeimg.setAttribute("src", "./images/image-unliked.png")
      if (track.like) {
         likeimg.setAttribute("src", "./images/image-liked.png")

      }
      likeimg.addEventListener('click', function (ev) {
         try {
            var src = likeimg.getAttribute("src");
            if (src.includes("image-unlike")) {
               likeimg.setAttribute("src", "./images/image-liked.png")
               ipcRenderer.invoke('update_track_liking', [track.location, true])
            }
            else {
               likeimg.setAttribute("src", "./images/image-unliked.png")
               ipcRenderer.invoke('update_track_liking', [track.location, false])
            }
         } catch (error) {
            alert(error.message);
         }
      });
      //pin
      let pinimg = document.createElement("img");
      pinimg.style.width = "15px";
      pinimg.style.height = "15px";
      pinimg.setAttribute("src", "./images/image-unpinned.png")
      if (track.pinned) {
         pinimg.setAttribute("src", "./images/image-pinned.png")
      }

      pinimg.addEventListener('click', function (ev) {
         try {
            var src = pinimg.getAttribute("src");
            if (src.includes("image-unpinned")) {
               pinimg.setAttribute("src", "./images/image-pinned.png")
               ipcRenderer.invoke('update_track_pinning', [track.location, true])
            }
            else {
               pinimg.setAttribute("src", "./images/image-unpinned.png")
               ipcRenderer.invoke('update_track_pinning', [track.location, false])
            }
         } catch (error) {
            alert(error.message);
         }
      });

      Likecolumn.appendChild(likeimg);
      Pincolumn.appendChild(pinimg)
      let audio = document.createElement('audio');
      audio.setAttribute("src", track.location)
      audio.addEventListener("loadedmetadata", function () {
         var val = audio.duration;
         c3.innerText = new Date(val * 1000).toISOString().slice(11, 19);;
      });
      // Insert data to cells 
      c2.innerText = track.title;
      //c3.innerText = track.length;
      c4.innerText = track.bpm;
      c5.innerText = track.artists;
      c6.innerText = track.album;

      // Append cells to row 
      row.appendChild(Pincolumn)
      row.appendChild(c2);
      row.appendChild(c3);
      row.appendChild(c4);
      row.appendChild(c5);
      row.appendChild(c6);
      row.appendChild(Likecolumn);
      row.setAttribute("data-path", track.location);
      row.addEventListener('dblclick', function (ev) {
         getclickedsong(this);
      });
      row.addEventListener('contextmenu', async (e) => {
         e.preventDefault()
         var pid = myTable.getAttribute("data-playlistid")
         if (pid == null) {
            alert("The playlist is Uknown. You cant Edit this Track!")
            return;
         }
         var x = await ipcRenderer.invoke('show_track_contextmenu', [track.location, pid])

         //refreshplaylisttracks(pid)
      })
      // Append row to table body 
      //alert(track.bpm.toString())
      table.appendChild(row)
   }
   catch (error) {
      alert(error.message)
   }

}
async function getclickedsong(track) {
   try {
      var songpath = track.getAttribute("data-path");
      var player = document.getElementById("myAudioPlayer");
      player.setAttribute("src", songpath);
      var tags = await ipcRenderer.invoke('readtags', songpath)
      var albumimage = document.getElementById("albumimage");
      if (tags != null) {
         if (tags.image != null) {
            let base64Image = Buffer.from(tags.image.imageBuffer).toString('base64');
            let imageTagsrc = "data:" + tags.image.imageBuffer.mime + ';base64,' + base64Image;
            albumimage.setAttribute('src', imageTagsrc)
         }
         else {
            albumimage.setAttribute('src', './images/musicimage.jpg')
         }
      }
      else {
         albumimage.setAttribute('src', './images/musicimage.jpg')
      }
      var tracktitle = document.getElementById("trackmarquee");
      tracktitle.innerText = songpath;
      player.play();
   }
   catch (error) {
      alert(error.message)
   }

}
async function markactiveplaylist(lielement){
   try {  
      var liElements = document.querySelectorAll("#sidebar_playlist li");
      liElements.forEach(i => {
         //remove the active element
         i.classList.remove("active");
      })
      //remove default playlist active attribute
      document.getElementById("btn_defaultplaylist").classList.remove("active"); 
      document.getElementById("btn_allfiles").classList.remove("active");
      document.getElementById("btn_myfavourites").classList.remove("active")
      //make the clicked item active
      lielement.classList.add("active");
      var x = await ClearTracksontable();
      if (!x) {
         return;
      }
      //stop playingitem
      document.getElementById("myAudioPlayer").setAttribute("src", "");
      let playertitle = document.getElementById("trackmarquee");
      playertitle.innerText = "";
 
   }
   catch (error) {
      alert(error.message);
   }
}
async function ClearTracksontable() {
   try {
      //remove all tracks on view 
      let mytable = document.getElementById("myTable");
      let mytablediv = document.getElementById("mytablediv");
      mytable.removeAttribute("data-playlistid");
      mytablediv.removeAttribute("data-playlistid");
      var trelements = document.querySelectorAll("#tableBody tr");
      trelements.forEach(row => row.remove());
      return true;
   } catch (error) {
      alert(error)
      return false;
   }
}
function refreshplaylisttracks(pl_id) {
   try {

      let playlistnamecontainer = document.getElementById("myTable");

      //remove all tracks on view
      let table = document.getElementById("tableBody");
      var trelements = document.querySelectorAll("#tableBody tr");
      trelements.forEach(row => row.remove());
      //stop playingitem
      let player = document.getElementById("myAudioPlayer").setAttribute("src", "");
      let playertitle = document.getElementById("trackmarquee");
      playertitle.innerText = "";

      //retrieve tracks for the above playlistid
      ipcRenderer.invoke('getplaylists_tracks', pl_id)
         .then(function (result) {
            var tracks = result;
            tracks.forEach(track => {
               addTracktoTable(track);
            });

         })
         .catch((error) => {
            alert(error);
         });
   }
   catch (error) {
      alert(error.message);
   }
}
// renderer
ipcRenderer.on('context-menu-command', (e, command) => {
   alert(command);
})


function getfiles(dirname) {
   try {

      fs.readdir(dirname, function (error, files) {

         if (error) {
            console.log(error);
            window.alert(error);
            return;
         }
         var listContainer = document.getElementById("files");
         files.forEach(function (el) {
            var t = path.join(mypath, el);
            fs.stat(t, (err, stats) => {
               if (err) {
                  addRow(err.message, err.code, 0);
               }

               if (stats.isFile()) {
                  addRow(t, el, stats.size.toString());
               }
            });
         });

      });
   }
   catch (error) {
      alert(error.message);
   }
}










/* function testmysql() {
   try {

      const mysql = require('mysql');
      const connection = mysql.createConnection({
         host: 'localhost',
         user: 'jstest',
         password: '1234',
         database: 'playlistmanager',
         port: 3306
      });

      connection.connect();
      alert("connected");
      connection.query('SELECT * from track', function (error, results, fields) {
         if (error) {
            alert(error.message);
         }
         results.forEach(element => {
            adddbrow(element.path, element.plays);
         });
      });
      alert("done");

      connection.end();
   }
   catch (error) {
      alert(error.message);
   }
} */
