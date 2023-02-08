const { ipcRenderer } = require('electron')


document.addEventListener('DOMContentLoaded', () => {

    try {

        displaymetadata();

        document.getElementById("btnsave").addEventListener('click', async event => {
            await Updatemetadata();
        }) 

        document.getElementById("btn_addartist").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Artist");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_addgenre").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Genre");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_addGrouping").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Grouping");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_addRemixer").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Remixer");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_addComposer").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Composer");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_addMood").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Mood");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_addTiming").addEventListener('click', async event => {
            var genreres = await ipcRenderer.invoke("shownewoptionwin", "Timing");
            if (genreres == "completed") {
                getselectoptionsfromdb();
            }
        })
        document.getElementById("btn_selectimage").addEventListener('click', async event => {
    
           try {
            var result = await ipcRenderer.invoke("selectcoverimage");
            if (result!=null) {
                document.getElementById('img_coverimage').setAttribute('data-imagepath', result);
                document.getElementById('img_coverimage').setAttribute('src',result)
            }
           } catch (error) {
            alert(error);
           }
        })
    }
    catch (err) {
        alert(err.message);
    }
});

async function displaymetadata() {
    try {

        ipcRenderer.on('sendtags', async (event, value) => {
            await getselectoptionsfromdb();
            var tags = value[1];
            if (value[0] !== "") {
                document.getElementById("btnsave").setAttribute("data-trackpath", value[0]);
                document.getElementById("tracklocation").value = value[0]
            }

            if (tags.title != null) {
                document.getElementById('title').setAttribute('value', tags.title);
            }
            if (tags.album != null) {
                document.getElementById('album').setAttribute('value', tags.album);
            }
            if (tags.year != null) {
                document.getElementById('year').setAttribute('value', tags.year);
            }
            if (tags.bpm != null) {
                document.getElementById('bpm').setAttribute('value', tags.bpm);
            }
            if (tags.initialKey != null) {
                document.getElementById('key').setAttribute('value', tags.initialKey);
            }
            if (tags.plays != null) {
                document.getElementById('plays').setAttribute('value', tags.plays);
            }
            if (tags.comment != null) {
                document.getElementById('comments').setAttribute('value', tags.comment.text);
            }
            if (tags.recordingDates != null) {
                document.getElementById('createdat').setAttribute('value', tags.recordingDates);
            }
            if (tags.size != null) {
                document.getElementById('size').setAttribute('value', tags.size);
            }
            if (tags.fileType != null) {
                document.getElementById('filetype').setAttribute('value', tags.fileType);
            }
            if (tags.length != null) {
                document.getElementById('length').setAttribute('value', tags.length);
            }
           
            if (tags.artist != null) {
                const myArray = tags.artist.split(",");
                await selectexistingoptions("artist_div", "artist", myArray);
            }
            if (tags.genre != null) {
                const myArray = tags.genre.split(",");
                await selectexistingoptions("genrecontainer", "genre", myArray);
            }
            if (tags.contentGroup != null) {
                const myArray = tags.contentGroup.split(",");
                await selectexistingoptions("grouping_div", "grouping", myArray);
            }
            if (tags.remixArtist != null) {
                const myArray = tags.remixArtist.split(",");
                await selectexistingoptions("remixer_div", "remixer", myArray);
            }
            if (tags.composer != null) {
                const myArray = tags.composer.split(",");
                await selectexistingoptions("composer_div", "composer", myArray);
            }
            if (tags.mood != null) {
                const myArray = tags.mood.split(",");
                await selectexistingoptions("mood_div", "mood", myArray);
            }
            if (tags.timings != null) { 
                const myArray = tags.timings.split(",");
                await selectexistingoptions("timing_div", "timing", myArray);
            }
            if (tags.image != null) { 
                //const dataUrl = `data:${tags.image.mime};base64,${tags.image.imageBuffer}`;
                let base64Image = Buffer.from(tags.image.imageBuffer).toString('base64');
                let imageTagsrc ="data:" + tags.image.imageBuffer.mime + ';base64,' + base64Image;
                document.getElementById('img_coverimage').setAttribute('src', imageTagsrc);
            }
        })
    } catch (error) {
        alert(error);
    }
}
async function selectexistingoptions(arg_selectdiv, tagid, optionsarray) {

    try {
        //get the options
        var select = document.getElementById(tagid);
        const existingoptions = Array.from(select.querySelectorAll('option'));
        const arg_options = existingoptions.map(option => option.text);
        //remove select tag
        var selectparent = document.getElementById(arg_selectdiv);
        selectparent.innerHTML = '';

        //create new select tag
        var itemselector = document.createElement("select")
        itemselector.setAttribute("multiple", "");
        itemselector.setAttribute("id", tagid);
        selectparent.appendChild(itemselector);
        arg_options.forEach(element => {
            var option = document.createElement("option");
            option.text = element;
            itemselector.appendChild(option);
        });

        // Loop through the options aand select items present before

        for (let i = 0; i < itemselector.options.length; i++) {
            for (let j = 0; j < optionsarray.length; j++) {
                if (itemselector.options[i].value == optionsarray[j]) {
                    itemselector.options[i].selected = true;
                }
            }

        }
        //initialize js tag
        new MultiSelectTag(tagid);
    } catch (error) {
        alert(error);
    }
}
async function Updatemetadata() {
    try {
        var track = document.getElementById("btnsave").getAttribute("data-trackpath");
        var newtitle = document.getElementById("title").value;
        var newalbum = document.getElementById("album").value;
        var newkey = document.getElementById("key").value;
        var newyear = document.getElementById("year").value;
        var newbpm = document.getElementById("bpm").value;
        var newbitrate = document.getElementById("bpm").value;
        var newsamplerate = document.getElementById("bpm").value;
        var comments = document.getElementById("comments").value;
        var newartist = getselectedoptions("artist");
        var newgroups = getselectedoptions("grouping");
        var newmoods = getselectedoptions("mood");
        var newtimings = getselectedoptions("timing");
        var newremixers = getselectedoptions("remixer");
        var newcomposers = getselectedoptions("composer");
        var newgenre = getselectedoptions("genre"); 
        var imagepath=document.getElementById('img_coverimage').getAttribute('data-imagepath');
        
        //alert(newartist)
        var tags = {
            title: newtitle,
            album: newalbum,
            artist: newartist,
            key: newkey,
            year: newyear,
            bpm: newbpm,
            image: null,
            comments: comments,
            genre: newgenre,
            contentGroup: newgroups,
            composer: newcomposers,
            remixArtist: newremixers,
            mood: newmoods,
            timing:newtimings,
        }
        if(imagepath!=null){
            tags.image=imagepath;
        }
        var finalobject = { trackpath: track, tags }
        var x = ipcRenderer.invoke('updatemetadata', finalobject)
        x.then(result => {
            alert(result)
        }).catch(error => {
            alert(error);
        })
    } catch (error) {
        alert(error);
    }
}

//get select opptions from db
//index 1-genre
//index 2-artist
//index 3-grouping
//index 4-remixer
//index 5-composer
//index 6-mood
//index 7-timing
async function getselectoptionsfromdb() {
    try {
        var result = await ipcRenderer.invoke("getselectoptionsfromdb");
        if (result == "error") {
            alert("Failed to get data from the database!")
            return;
        }
        document.getElementById("artist");
        refresh_selectoptions("genrecontainer", "genre", result[0]);
        refresh_selectoptions("artist_div", "artist", result[1]);
        refresh_selectoptions("grouping_div", "grouping", result[2]);
        refresh_selectoptions("remixer_div", "remixer", result[3]);
        refresh_selectoptions("composer_div", "composer", result[4]);
        refresh_selectoptions("mood_div", "mood", result[5]);
        refresh_selectoptions("timing_div", "timing", result[6]);
    } catch (error) {
        alert(error);
    }
}

//refresh select options from db
function refresh_selectoptions(arg_selectdiv, argselectid, arg_options) {
    try {

        var selecteditems = [];
        var sel_tag = document.getElementById(argselectid);
        if (sel_tag.options.length > 0) {
            for (var option of sel_tag.options) {
                if (option.selected) {
                    selecteditems.push(option.text);
                }
            }
        }

        //remove select tag
        var selectparent = document.getElementById(arg_selectdiv);
        selectparent.innerHTML = '';
        //create new select tag
        var itemselector = document.createElement("select")
        itemselector.setAttribute("multiple", "");
        itemselector.setAttribute("id", argselectid);
        selectparent.appendChild(itemselector);
        arg_options.forEach(element => {
            var option = document.createElement("option");
            option.text = element.name;
            itemselector.appendChild(option);
        });

        // Loop through the options aand select items present before
        for (var i = 0; i < selecteditems.length; i++) {

            for (var j = 0; j < itemselector.options.length; j++) {
                if (itemselector.options[j].value == selecteditems[i]) {
                    itemselector.options[j].selected = true;
                    break;
                }
            }
        }
        //initialize js tag
        new MultiSelectTag(argselectid);
    } catch (error) {
        alert(error);
    }
}
//get select tag selected options
function getselectedoptions(selecttagid) {
    try {
        var tag = document.getElementById(selecttagid)
        var selected = [];
        for (var option of tag.options) {
            if (option.selected) {
                selected.push(option.text);
            }
        }
        return selected.toString();
    } catch (error) {
        return "";
    }
}