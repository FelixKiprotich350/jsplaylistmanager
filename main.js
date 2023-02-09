const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const path = require('path');
const fs = require('fs-extra');
const musicMetadata = require('music-metadata-browser');
//require('@electron/remote/main').initialize()
const { PrismaClient } = require('@prisma/client');
const { group } = require('console');
const prisma = new PrismaClient();
var win = null;
var metawindow = null;
//initialize app
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:800,
    minHeight:600,
    show:false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.maximize();
  win.loadFile('main.html');

  //win.openDevTools();
  win.on('close', () => {
    app.quit();
  })
};

app.whenReady().then(() => {

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
ipcMain.handle('showMessageBox', async (event, arg) => {
  const { dialog } = require('electron')
  
  const options = {
    type: "info",
    buttons: ["Okay"],
    title: "Message Box!",
    message: arg
  }
  
var parent_window=BrowserWindow.getFocusedWindow();
  dialog.showMessageBox(parent_window, options)
});


//track functions begin here
ipcMain.handle('readtags', async(event,arg)=>{
 return await readtags(arg);
});

ipcMain.handle('editTrack', async (event, arg1) => {
  return await EditTrack(arg1);
});
ipcMain.handle('updatemetadata', async (event, arg1) => {
  return await updatemetadata(arg1);
})
ipcMain.handle('show_track_contextmenu', async (event, arg) => {
  const template = [
    {
      label: 'Edit Metadata',
      click: () => { EditTrack(arg[0]) }
    },

    { type: 'separator' },
    {
      label: 'Move Track',
      click: () => { movetrack(arg[0]) }
    },

    { type: 'separator' },
    {

      label: 'Remove Track from Playlist',
      click: () => { remove_Track_fromplaylist(arg) }
    },
    { type: 'separator' },
    {

      label: 'Delete Track',
      click: () => { delete_Track(arg[0]) }
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  await menu.popup(BrowserWindow.fromWebContents(event.sender))
  return;
})
ipcMain.handle('update_track_pinning', async (event, arg) => {
  return await UpdatePinnedTrack(arg);
})
ipcMain.handle('update_track_liking', async (event, arg) => {
  return await UpdateLikedTrack(arg);
})
ipcMain.handle('selectcoverimage', async (event, arg) => {
  return await Selectcoverimage(arg);
});
ipcMain.handle("getfavouritetracks", async (event) => {
  return await getfavtracks();
});
ipcMain.handle("getalltracks", async (event) => {
  return await getalltracks();
});
async function getfavtracks() {
  try {
    prisma.$connect();
    const c = await prisma.track.findMany({
      where: {
        like: true,
      }
    });
    c.forEach(item=>{
      if(item.title==null){
        item.title = path.basename(item.location);
      }
      else{
        if(item.title.trim()==""){
          item.title = path.basename(item.location);
        }
      }
    })
    return c;
  } catch (error) {
    console.log(error);
    return "error";
  }
}
async function getalltracks() {
  try {
    prisma.$connect();
    const tracks = await prisma.track.findMany({});
    tracks.forEach(item=>{
      if(item.title==null){
        item.title = path.basename(item.location);
      }
      else{
        if(item.title.trim()==""){
          item.title = path.basename(item.location);
        }
      }
    })
    prisma.$disconnect();
    const final = tracks.sort((a, b) => b.pinned - a.pinned);
    return final;
  } catch (error) {
    console.log(error);
    return "error";
  }
}
async function Selectcoverimage(arg) {
  try {
    const { dialog } = require('electron')

    var res = await dialog.showOpenDialog(metawindow, {
      properties: ["openFile"], filters: [
        { name: 'Images', extensions: ['jpeg', 'png'] }
      ]
    })
    if (!res.canceled) {
      if (res.filePaths.length > 0) {
        console.log(res.filePaths[0])

        return res.filePaths[0];
      } else {
        return null;
      }
    }
    else {
      return null;
    }
  }
  catch (err) {
    return null;
  }

}
async function UpdatePinnedTrack(arg) {
  try {
    const c = await prisma.track.update({
      where:
      {
        location: arg[0],
      },
      data: {
        pinned: arg[1],
      }
    })
  }
  catch (error) {

  }
}
async function UpdateLikedTrack(arg) {
  try {
    const c = await prisma.track.update({
      where:
      {
        location: arg[0],
      },
      data: {
        like: arg[1],
      }
    })
  }
  catch (error) {

  }
}
async function EditTrack(trackpath) {
  try {
    var tags = await readtags(trackpath)
    try {
      prisma.$connect();
      const track = await prisma.track.findFirst({
        where: {
          location: trackpath,
        }
      });
      if (track != null) {
        tags.recordingDates = track.createdAt.toDateString();
        tags.size = track.size;
        tags.fileType = track.fileType;
        tags.length = track.length;
        tags.timings = track.timings;
      }
      prisma.$disconnect();
    }
    catch (error) {
      console.log(error);
    }
    // Create a new BrowserWindow instance
    metawindow = new BrowserWindow({
      width: 500,
      height: 600,
      modal: true,
      parent: win,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      }
    });

    metawindow.loadFile('metadata.html');
    //newWindow.openDevTools();
    metawindow.setMenu(null);
    metawindow.show();

    metawindow.webContents.on('dom-ready', () => {
      metawindow.webContents.send('sendtags', [trackpath, tags])
    })
    // console.log(tags) 

  }
  catch (error) {
    console.log(error);
  }
}
async function movetrack(trackpath) {
  try {
    var track = await prisma.track.findFirst({
      where: {
        location: trackpath,
      }
    })
    if (track == null) {
      return false;
    }
    var sd = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    if (sd.canceled | sd.filePaths.length <= 0) {
      return false;
    }
    var filename = path.basename(trackpath);
    var newfilepath = path.join(sd.filePaths[0], filename)
    await fs.move(trackpath, newfilepath, { overwrite: true }, (error) => {
      if (error) {
        return false;
      }
    })

    await prisma.track.update({
      where: {
        id: track.id,
      },
      data: {
        location: newfilepath,
      }
    })
    return true;
  }
  catch (error) {
    console.log(error);
    return false;
  }
}
async function readtags(trackpath) {
  try {

    const nodeID3 = require('node-id3');
    var tags = await nodeID3.read(trackpath)
    console.log(tags)
    //var mp3Duration = require('mp3-duration');

    /* mp3Duration(trackpath, function (err, duration) {
      if (err) return console.log(err.message);
      console.log('Your file is ' + duration + ' seconds long');
    }); */

    return tags;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}
async function updatemetadata(trackpath) {
  try {
    console.log("writing.....")

    var test = await fs.createReadStream(trackpath.trackpath)
    const metadata = await musicMetadata.parseNodeStream(test, null, { duration: true });

    const nodeID3 = require('node-id3')
    //tags.image is the path to the image (only png/jpeg files allowed)
    var senttags = trackpath.tags;
    const tags = {
      title: senttags.title,
      artist: senttags.artist,
      album: senttags.album,
      initialKey: senttags.key,
      bpm: senttags.bpm,
      year: senttags.year,
      comment: {
        language: "eng",
        text: senttags.comments
      },
      genre: senttags.genre,
      contentGroup: senttags.contentGroup,
      composer: senttags.composer,
      remixArtist: senttags.remixArtist,
      mood: senttags.mood,

    }
    var finaltags = null;
    if (senttags.image != null) {

      var imagetag = { image: senttags.image, }
      let x = {
        ...tags,
        ...imagetag
      };
      finaltags = x;
    } else {
      finaltags = tags;
    }

    console.log(finaltags)
    var tpath = trackpath.trackpath;
    const success = nodeID3.write(finaltags, tpath)
    const dbwrite = await prisma.track.update({
      where: {
        location: tpath,
      },
      data: {
        title: senttags.title,
        bpm: senttags.bpm,
        artists: senttags.artist,
        album: senttags.album,
        initialKey: senttags.key,
        year: senttags.year,
        comments: senttags.comments,
        /*biterate: senttags.bpm,
        samplerate: senttags.bpm, */
        updateDate: new Date().toISOString(),
        groups: senttags.contentGroup,
        moods: senttags.mood,
        timings: senttags.timing,
        genres: senttags.genre,
        composers: senttags.composer,
        remixers: senttags.remixArtist,
      },
    })
    console.log(success)
    return success;
  }
  catch (error) {
    console.log(error)
    return error;
  }
}
async function remove_Track_fromplaylist(arg) {
  try {
    if(arg==null){
      return;
    }
    prisma.$connect();
    const track = await prisma.track.findFirst({
      where: {
        location: arg[0],
      }
    })
    const traconplaylist = await prisma.playlistOnTrack.deleteMany({
      where: {
        trackId: track.id.toString(),
        playlistId: arg[1].toString(),
      }
    })
    prisma.$disconnect();
    return true;
  }
  catch (error) {
    return error;
  }
}
async function gettrackbypath(track_path) {
  try {
    prisma.$connect();
    const track = await prisma.track.findFirst({ where: { location: track_path } });

    prisma.$disconnect();
    return track;
  } catch (error) {
    console.log(error)
    return null;
  }
}
async function searchcontains(id1) {
  try {
    prisma.$connect();
    const c = await prisma.track.findMany({
      where: {
        fileType: {
          contains: id1,
        }
      }
    });
    console.log(c.map(k => k.fileType));
    return c;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function delete_Track(trackpath) {
  try {
    const track = await prisma.track.delete({
      where: {
        location: trackpath,
      }
    })
    const traconplaylist = await prisma.playlistOnTrack.deleteMany({
      where: {
        trackId: track.id.toString(),
      }
    })
    console.log("Deleting ....")
    await fs.remove(trackpath, err => {
      if (err) {
        console.error(err);
        return;
      }
      else {
        console.log('success!')
      }

    });
    return true;
  }
  catch (error) {
    console.log(error)
    return error;
  }
}



//mettadata editing
//add selection options
ipcMain.handle('shownewoptionwin', async (event, arg) => {
  return await shownewselectwindow(arg);
})
ipcMain.handle('addnewselectoption', async (event, arg) => {
  return await creategenre(arg);
})
ipcMain.handle('getselectoptionsfromdb', async (event) => {
  return await getselectoptionsfromdb();
})
async function shownewselectwindow(title) {

  return new Promise((resolve, reject) => {
    try {
      // Create a new BrowserWindow instance
      var genrewin = new BrowserWindow({
        width: 300,
        height: 150,
        modal: true,
        maximizable:false,
        minimizable:false,
        resizable:false,
        parent: metawindow,
        alwaysOnTop: true,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
          contextIsolation: false,
        }
      });
      genrewin.title = "Add new - " + title;
      genrewin.loadFile('./addnewselectoption/index.html');
      //newWindow.openDevTools();
      genrewin.setMenu(null);

      genrewin.on('closed', () => {
        resolve("completed")
        genrewin = null
      })
      genrewin.show();
      genrewin.webContents.on('did-finish-load', () => {
        genrewin.webContents.send('send-optiontype', title)
      })
    }
    catch (error) {
      console.log(error);
      reject("error")
    }
  });

}

async function creategenre(arg) {
  try {
    prisma.$connect();
    var optype = arg[0];
    if (optype == "Artist") {
      const c = await prisma.artist.create({
        data: {
          name: arg[1]
        }
      });
    }
    else if (optype == "Genre") {
      const c = await prisma.genre.create({
        data: {
          name: arg[1]
        }
      });
    }
    else if (optype == "Grouping") {
      const c = await prisma.group.create({
        data: {
          name: arg[1]
        }
      });
    }
    else if (optype == "Remixer") {
      const c = await prisma.remixer.create({
        data: {
          name: arg[1]
        }
      });
    }
    else if (optype == "Composer") {
      const c = await prisma.composer.create({
        data: {
          name: arg[1]
        }
      });
    }
    else if (optype == "Mood") {
      const c = await prisma.mood.create({
        data: {
          name: arg[1]
        }
      });
    }
    else if (optype == "Timing") {
      const c = await prisma.timing.create({
        data: {
          name: arg[1]
        }
      });
    }
    else {
      return "Unknown option";
    }
    prisma.$disconnect();
    return "Saved";
  } catch (error) {
    console.log(error);
    return error;
  }
}
//get select options from db
async function getselectoptionsfromdb() {
  try {
    prisma.$connect();
    const genre = await prisma.genre.findMany({});
    const artist = await prisma.artist.findMany({});
    const groups = await prisma.group.findMany({});
    const remixer = await prisma.remixer.findMany({});
    const composer = await prisma.composer.findMany({});
    const mood = await prisma.mood.findMany({});
    const timing = await prisma.timing.findMany({});
    var final = [genre, artist, groups, remixer, composer, mood, timing]
    prisma.$disconnect();
    return final;
  } catch (error) {
    console.log(error);
    return "error";
  }
}


//playlists manage
//playlist functions
ipcMain.handle('getallplaylists', getallplaylists);
ipcMain.handle('getplaylists_tracks', async (event, arg1) => {
  // Do something with the arguments
  return getplaylists_tracks(arg1);
});
ipcMain.on('show_playlist_contextmenu', (event, arg) => {


  var template = [
    {
      label: 'Rename Playlist',
      //id: arg.toString(),
      click: () => { showrenameplaylistwindow(arg) }
    },

    { type: 'separator' },
    {
      label: 'Delete this playlist',
      click: () => { deleteplaylist(arg) }
    },
  ]
  var menu = [];
  if (parseInt(arg) == 0) {
    var export_template = [
      {
        label: 'Export playlist',
        click: () => { Exportplaylist(arg) }
      },

      { type: 'separator' },
    ]
    menu = Menu.buildFromTemplate(export_template)
  }
  else {
    var template = [
      {
        label: 'Rename Playlist',
        //id: arg.toString(),
        click: () => { showrenameplaylistwindow(arg) }
      },
      { type: 'separator' },
      {
        label: 'Export playlist',
        click: () => { Exportplaylist(arg) }
      },
      { type: 'separator' },
      {
        label: 'Delete this playlist',
        click: () => { deleteplaylist(arg) }
      },
    ]
    menu = Menu.buildFromTemplate(template)
  }
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})
ipcMain.handle('renameplaylist', async (event, arg) => {
  return await renameplaylistondb(arg)
})
ipcMain.handle('addnewplaylist', async (event, arg) => {
  return await addplaylist(arg)
})
ipcMain.handle('showaddplaylistwindow', async (event) => {
  return await showaddplaylistwindow();
})
ipcMain.handle('addtrackstoplaylist', async (event, arg1) => {
  return addtrackstoplaylist(arg1);
})
async function getallplaylists() {
  try {
    await prisma.$connect();
    //query data
    var playlist = await prisma.playlist.findMany();
    //console.log(allUsers[0].id);
    await prisma.$disconnect();
    return playlist;

  }
  catch (error) {
    return error.message;
  }
}
async function getplaylists_tracks(playlistid) {
  try {
    prisma.$connect();
    //query data 
    const modelList = await prisma.playlistOnTrack.findMany({
      where: { playlistId: playlistid.toString() },
    });
    const trackidarray = modelList.map(model => model.trackId);
    var tracks = [];
    var filename = "";
    for (var x = 0; x < trackidarray.length; x++) {
      const y = await getrackstbyid(trackidarray[x]);
      if (y != null) {
        filename = path.basename(y.location);
        if (y.title == null | y.title == "") {
          y.title = filename;
        }
        tracks.push(y);
      }
    } 
    await prisma.$disconnect();
    const final = tracks.sort((a, b) => b.pinned - a.pinned);
    return final;

  }
  catch (error) {
    console.log(error)
    return null;

  }
}
async function getrackstbyid(id1) {
  try {
    prisma.$connect();
    const c = await prisma.track.findFirst({ where: { id: parseInt(id1) } });
    prisma.$disconnect();
    return c;
  } catch (error) {
    return null;
  }
}
async function addtrackstoplaylist(arg) {

  try {
    var playlist = arg.playlistid;
    if (playlist == "default") {
      playlist = 0;
    }
    var tracks = arg.tracks;

    prisma.$connect();
    var x = 0;
    for (x = 0; x < tracks.length; x++) {
      const filestat = await (await fs.stat(tracks[x]))
      if (filestat.isFile() == false) {
        return;
      }
      var ftype = await path.extname(tracks[x]);
      var tags = await readtags(tracks[x])
      var stream = await fs.createReadStream(tracks[x])
      const meta = await musicMetadata.parseNodeStream(stream, null, { duration: true });
      const c = await prisma.track.count({ where: { location: tracks[x] } });
      let y = null;
      var candelete = false;
      var duration = parseInt(meta.format.duration);
      var bitrate = parseInt(meta.format.bitrate);
      var samplerate = parseInt(meta.format.sampleRate);
      //crreate track
      try {

        if (c <= 0) {
          y = await prisma.track.create({
            data: {
              location: tracks[x],
              createdAt: filestat.birthtime.toISOString(),
              bpm: tags.bpm,
              album: tags.album,
              fileType: ftype,
              initialKey: tags.initialKey,
              length: duration.toString(),
              size: filestat.size.toString(),
              year: tags.year,
              plays: "0",
              biterate: bitrate.toString(),
              samplerate: samplerate.toString(),
              like: false,
              pinned: false,
              updateDate: new Date().toISOString()
            }
          });
          candelete = true;
        }
        else {
          y = await prisma.track.findFirst({ where: { location: tracks[x] } });
        }
        console.log(y)
        if (y != null) {
          const z = await prisma.playlistOnTrack.create({
            data: {
              trackId: y.id.toString(),
              playlistId: playlist,
            }
          });
        }


      } catch (error) {
        if (candelete) {
          await prisma.track.delete({ where: { location: tracks[x] } });
        }
        console.log(error.message)
      }

    }
    await prisma.$disconnect();
    return true;

  }
  catch (error) {
    console.log(error.message);
    return false;
  }
}
async function showrenameplaylistwindow(playlistid) {
  try {
    const playlist = await prisma.playlist.findMany({
      where: {
        id: playlistid,
      }
    })
    try {
      // Create a new BrowserWindow instance
      var RenameWin = new BrowserWindow({
        width: 300,
        height: 200,
        modal: true,
        maximizable:false,
        minimizable:false,
        resizable:false,
        parent: metawindow,
        alwaysOnTop: true,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
          contextIsolation: false,
        }
      });
      RenameWin.title = "Rename Playlist";
      RenameWin.loadFile('./manageplaylist/renameplaylist.html');
      //newWindow.openDevTools();
      RenameWin.setMenu(null);

      RenameWin.show();
      RenameWin.webContents.on('did-finish-load', () => {
        RenameWin.webContents.send('rename-current-playlist', playlist)
      })
    }
    catch (error) {
      console.log(error);
    }
    return true;
  }
  catch (error) {
    return error;
  }
}
async function renameplaylistondb(playlistname) {
  try {
    var pid = playlistname[0];
    var pname = playlistname[1];
    const user = await prisma.playlist.update({
      where: {
        id: parseInt(pid),
      },
      data: {
        name: pname,
      },
    })
    console.log(pid);
    return true;
  }
  catch (error) {
    console.log(error);
    return error;
  }
}
async function addplaylist(playlistname) {
  try {
    const playlist = await prisma.playlist.create({
      data: {
        name: playlistname,
      }
    })
    console.log(playlist)
    win.webContents.send('newplaylistadded',playlist);
    BrowserWindow.getFocusedWindow().close();
    return true;
  }
  catch (error) {
    console.log(error)
    return error;
  }
}
async function deleteplaylist(playlistid) {
  try {
    const playlist = await prisma.playlist.delete({
      where: {
        id: parseInt(playlistid),
      }
    })
    console.log(playlist)
    win.webContents.send('onplaylistdeleted',playlist);
    return true;
  }
  catch (error) {
    return error;
  }
}
async function showaddplaylistwindow() {
  try {
    // Create a new BrowserWindow instance
    var addplaylist = new BrowserWindow({
      width: 300,
      height: 150,
      modal: true,
      parent: metawindow,
      maximizable: false,
      minimizable: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      }
    });
    addplaylist.title = "Add Playlist";
    addplaylist.loadFile('./manageplaylist/addplaylist.html');
    //newWindow.openDevTools();
    addplaylist.setMenu(null);
    addplaylist.show();
  }
  catch (error) {
    console.log(error);
  }
}

async function Exportplaylist(pl_id) {
  try {
    const seratojs = require("seratojs");
    var playlist = null;
    try {
      prisma.$connect();
      playlist = await prisma.playlist.findFirst({ where: { id: parseInt(pl_id) } });
      prisma.$disconnect();
    } catch (error) {
    }
    // List all crates defined by user.
    //const crates = seratojs.listCratesSync();
    //console.log(crates);

    // List all song filepaths in a given crate.
    //const crate = crates[0];
    //const songs = crate.getSongPathsSync();
    //console.log(songs);

    // Create a crate
    if (playlist == null) {
      return;
    }
    var tracks = await getplaylists_tracks(pl_id);

    const newCrate = new seratojs.Crate(playlist.name.toString());
    tracks.forEach(element => {
      
      newCrate.addSong(element.location);
    });
    console.log(playlist.name);
    newCrate.saveSync(); 
  }
  catch (error) {
    console.log(error);
  }
}

