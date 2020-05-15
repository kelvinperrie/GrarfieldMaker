
$(document).ready(function() {
    var _builder = new builder();

    _builder.SetupPage();

    $("#chunk-selector .available-chunk").on('click', function() {
        var chunkName = $(this).data("chunkname");
        _builder.AddChunkToPage(chunkName);
    });

    // toolbar buttons
    $("#move-forwards-button").on("click", function() {
        _builder.MoveTowardsFront();
    });
    $("#move-backwards-button").on("click", function() {
        _builder.MoveTowardsBack();
    });
    $("#clear-selection-button").on("click", function() {
        _builder.MakeSelected();
    });
    $("#delete-button").on("click", function() {
        _builder.DeleteSelected();
    });
    $("#open-for-viewing-button").on("click", function() {
        _builder.OpenForView();
    });
    $("#editor-link").on("click", function() {
        _builder.OpenForEditing();
    });
    $("#flip-on-horizontal").on("click", function() {
        _builder.FlipHorizontal();
    });
    $("#clear-all").on("click",function() {
        if (confirm('Are you sure you want to delete your creation?')) {
            _builder.ClearAll();
        }
    });
    $("#cartoon-container").on("click", function() {
        _builder.MakeSelected();
    });
});

var builder = function() {
    var self = this;

    self.htmlContainer = "#cartoon-container";          // handle for a dom element that holds the comic
    self.availableChunkContainer = "#chunk-selector";   // handle for a dom element where a preview of the chunks that can be added to the comic are displayed
    self.availableChunks = [];                          // a collection of the chunks that can be added to the comic
    self.chunkCounter = 0;                              // how many chunks we added to the comic? used to generate element ids
    self.showEditor = false;                            // indicates whether we are editing the comic or viewing it

    // setup the page; show/hide editor tools, load up any chunky chunk chunks
    self.SetupPage = function() {
        var url = new URL(window.location.href);
        
        // based on query string params, do we need to load some objects into the 'comic'
        // objects will be passed in the persist query string param
        var persistance = url.searchParams.get("persist");
        if(persistance) {
            var jsonObject = JSON.parse(persistance);
            self.LoadPersistance(jsonObject);
        }

        // whether the editing tools show or not is based on the editorRequired query string param
        // if no persistance (i.e. nothing to view) then show the editor
        var editorRequired = url.searchParams.get("editorRequired");
        if(!persistance || editorRequired == "true") {
            self.showEditor = true;
            self.OutputAvailableChunks(self.availableChunkContainer);
            $("#chunk-selector").show();    // hide avaiable chunks
            $("#selected-toolbar").show();  // hide editor tools
            $("#editor-link").hide();       // show link to editor
            self.UpdateToolBarButtonEnablednesssss(); // update the toolbar buttons to be enabled/disabled
        }
    }

    // displays the possible chunks on the editor toolbar so that they can be clicked/added to the comic
    self.OutputAvailableChunks = function(container) {
        for(var i = 0; i < self.availableChunks.length; i++) {
            var selectable = "<div class='available-chunk' data-chunkname='"+self.availableChunks[i].name+"'><div class='chunk-data'>"+self.availableChunks[i].generateHtml()+"</div><div class='chunk-name'>"+self.availableChunks[i].name+"</div></div>"
            $(container).append(selectable);
        }
    }

    // given some json that describes some chunks, load 'em on the page
    self.LoadPersistance = function(chunks) {
        for(var i=0; i < chunks.length; i++) {
            var newId = self.AddChunkToPage(chunks[i].name);
            $(newId).attr("style",chunks[i].style);
            if(chunks[i].text) {
                $(newId).text(chunks[i].text);
            }
        }
    }
    // opens the comic in a new window for viewing (no editor toolbar etc)
    self.OpenForView = function() {
        var currentUrl = window.location.href.split('?')[0];
        var persistance = self.MakePersistance();
        var newUrl = currentUrl + "?persist=" + persistance
        window.open(newUrl,'_blank');
    }
    // open the comic in the current window for editing
    self.OpenForEditing = function() {
        var currentUrl = window.location.href.split('?')[0];
        var persistance = window.location.href.split('?')[1];
        var newUrl = currentUrl + "?editorRequired=true&" + persistance
        window.open(newUrl,"_self");
    }

    // goes through all the items on the comic and makes a big ol' string that describes them so we can pass it around
    self.MakePersistance = function() {
        //persist=%5B%7B"name":"Bkgrnd%20greenish","style":"width:%20383px;%20height:%20329px;%20z-index:%20100;%20left:%205px;%20top:%2045px;"%7D,%7B"name":"Bkgrnd%20yellowish","style":"width:%20383px;%20height:%20329px;%20z-index:%20100;%20left:%20396px;%20top:%2023px;"%7D,%7B"name":"Bkgrnd%20greenish","style":"width:%20383px;%20height:%20329px;%20z-index:%20100;%20left:%20786px;%20top:%2061px;"%7D,%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%20120;%20left:%20783px;%20top:%2059px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%20110;%20left:%20786px;%20top:%20339px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%20110;%20left:%20394px;%20top:%20307px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%20110;%20left:%2010px;%20top:%20326px;"%7D,%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%20120;%20left:%20394px;%20top:%2025px;"%7D,%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%20120;%20left:%204px;%20top:%2044px;"%7D,%7B"name":"Grarfield%20upper","style":"width:%20110px;%20height:%20140px;%20z-index:%20150;%20left:%2035px;%20top:%20189px;"%7D,%7B"name":"Joan%20man","style":"width:%20105px;%20height:%20201px;%20z-index:%20150;%20left:%20243px;%20top:%20128px;"%7D,%7B"name":"Grarfield%20upper","style":"width:%20110px;%20height:%20140px;%20z-index:%20150;%20left:%20431px;%20top:%20170px;"%7D,%7B"name":"Joan%20man","style":"width:%20105px;%20height:%20201px;%20z-index:%20150;%20left:%20614px;%20top:%20109px;"%7D,%7B"name":"Grarfield%20upper","style":"width:%20110px;%20height:%20140px;%20z-index:%20150;%20left:%20833px;%20top:%20203px;"%7D,%7B"name":"Joan%20man","style":"width:%20105px;%20height:%20201px;%20z-index:%20150;%20left:%201009px;%20top:%20141px;"%7D,%7B"name":"Talking%20bubble","style":"z-index:%20150;%20left:%2047px;%20top:%20122px;","text":"monday"%7D,%7B"name":"Talk%20bubble%20spike","style":"width:%2025px;%20height:%2026px;%20z-index:%20150;%20left:%2066px;%20top:%20160px;"%7D,%7B"name":"Talking%20bubble","style":"z-index:%20150;%20left:%20533px;%20top:%2056px;","text":"monday"%7D,%7B"name":"Talk%20bubble%20spike","style":"width:%2025px;%20height:%2026px;%20z-index:%20150;%20left:%20585px;%20top:%2093px;%20transform:%20matrix(-1,%200,%200,%201,%200,%200);"%7D,%7B"name":"Talking%20bubble","style":"z-index:%20150;%20left:%20852px;%20top:%20121px;","text":"monday"%7D,%7B"name":"Talk%20bubble%20spike","style":"width:%2025px;%20height:%2026px;%20z-index:%20150;%20left:%20875px;%20top:%20159px;"%7D%5D
        var everythingIsGrand = [];
        $("#cartoon-container .chunk").each(function() {
            var persistMe = {
                "name" : $(this).data("name"),
                "style" : $(this).attr("style"),
            }
            if($(this).hasClass("speech-bubble")) {
                persistMe["text"] = $(this).text();
            }
            everythingIsGrand.push(persistMe);
        });
        var bigStupidString = JSON.stringify(everythingIsGrand);
        console.log(bigStupidString);
        var stupidEncoded = encodeURI(bigStupidString);
        return stupidEncoded;
    }

    // given a unique name of a chunk, will add that chunk to the page and SET IT UP (e.g. make it draggable)
    self.AddChunkToPage = function(name) {
        self.chunkCounter++;
        var id = 'chunk' + self.chunkCounter;
        var html = self.GetChunkHtml(name, id);
        if(!html) return;

        $(self.htmlContainer).append(html);
        if(self.showEditor) {
            $("#" + id).draggable();
            // clicking a thing should select it
            $("#" + id).on('click', function(event){
                self.MakeSelected($(this));
                event.stopPropagation();
            });
            // text in speech bubbles should be editable on double click
            if($("#" + id).hasClass('speech-bubble')) {
                $("#" + id).on('dblclick', function(event){
                    var currentText = $("#" + id).html();
                    var text = window.prompt('Say what:', currentText);
                    $("#" + id).html(text);
                    event.stopPropagation();
                });
            }
            
        }
        return "#" + id;
    }

    // retrieves the html for a chunk from the avaiable chunks collllllllection
    self.GetChunkHtml = function(name, id) {
        for(var i = 0; i < self.availableChunks.length; i++) {
            if(name === self.availableChunks[i].name) {
                return self.availableChunks[i].generateHtml(id);
            }
        }
    }
    self.UpdateToolBarButtonEnablednesssss = function() {
        if($('.selected').length == 0) {
            $(".requires-selection").addClass("disabled");
        } else {
            $(".requires-selection").removeClass("disabled");
        }
    }
    self.DeleteSelected = function() {
        $('.selected').remove();
        self.UpdateToolBarButtonEnablednesssss();
    }
    self.MakeSelected = function(chunk) {
        self.ClearSelected();
        $(chunk).addClass('selected');
        self.UpdateToolBarButtonEnablednesssss();
    }
    self.ClearSelected = function() {
        $("#cartoon-container .chunk").removeClass('selected');
        self.UpdateToolBarButtonEnablednesssss();
    }
    self.MoveTowardsFront = function() {
        var currentZ = $('.selected').css("z-index");
        currentZ = parseInt(currentZ) + 10;
        $('.selected').css('z-index', currentZ);
    }
    self.MoveTowardsBack = function() {
        var currentZ = $('.selected').css("z-index");
        currentZ = parseInt(currentZ) - 10;
        $('.selected').css('z-index', currentZ);
    }
    self.FlipHorizontal = function() {
        var currentTransform = $('.selected').css("transform");
        var newTransform = "matrix(-1, 0, 0, 1, 0, 0)";
        if(currentTransform == newTransform) {
            newTransform = "matrix(1, 0, 0, 1, 0, 0)";
        }
        $('.selected').css("transform", newTransform);
    }
    self.ClearAll = function() {
        console.log("asdf");
        $("#cartoon-container").html("");
    }

    // setup the possible things that can be added to the comic
    self.availableChunks.push(new chunk("image", "Frame","frame1.png",{ width: 383, height: 329 },120));
    self.availableChunks.push(new chunk("image", "Bench","bench1.png",{ width: 380, height: 48 },110));
    self.availableChunks.push(new chunk("image", "Bkgrnd yellowish","background1.png",{ width: 383, height: 329 },100));
    self.availableChunks.push(new chunk("image", "Bkgrnd greenish","background2.png",{ width: 383, height: 329 },100));
    self.availableChunks.push(new chunk("image", "Grarfield upper","grarfield-upper.png",{ width: 110, height: 140 },150));
    self.availableChunks.push(new chunk("image", "Grarfield","grarfield.png",{ width: 127, height: 207 },150));
    self.availableChunks.push(new chunk("image", "Grarfield in bed","grarfield-bed.png",{ width: 209, height: 143 },150));
    self.availableChunks.push(new chunk("image", "Grarfield hide bed","grarfield-escape-life.png",{ width: 196, height: 138 },150));
    self.availableChunks.push(new chunk("image", "Joan man","joan-man.png",{ width: 105, height: 201 },150));
    self.availableChunks.push(new chunk("image", "Gormless dog head","gormless-dog-upper.png",{ width: 87, height: 146 },150));
    self.availableChunks.push(new chunk("image", "Gormless dog","gormless-dog.png",{ width: 111, height: 192 },150));
    self.availableChunks.push(new chunk("image", "Other cat","other-cat.png",{ width: 113, height: 118 },150));
    self.availableChunks.push(new chunk("image", "Spider","spider.png",{ width: 38, height: 28 },150));
    self.availableChunks.push(new chunk("image", "Spectre of death","spectre-of-death.png",{ width: 104, height: 115 },150));
    self.availableChunks.push(new chunk("image", "Scooby","scooby.png",{ width: 109, height: 154 },150));
    self.availableChunks.push(new chunk("talking", "Talking bubble","Example text",{ width: 200, height: 200 },150));
    self.availableChunks.push(new chunk("image", "Talk bubble spike","speech-spike.png",{ width: 25, height: 26 },150));

    

};

// object to describe a thing that can be added to the comic
var chunk = function(type, name, data, size, zindex) {
    var self = this;
    self.id;
    self.type = type;
    self.name = name;
    self.data = data;
    self.size = size;
    self.zindex = zindex;
    self.generateHtml = function(id) {
        self.id = id;
        var html;
        if(self.type === 'image') {
            html = "<img id='"+self.id+"' data-name='"+self.name+"' src='images/"+self.data+"' alt='"+self.name+"' style='width: "+self.size.width+"px; height: "+self.size.height+"px; z-index: "+self.zindex+";'  class='chunk' />";
        } else if(self.type === 'talking') {
            html = "<div id='"+self.id+"' data-name='"+self.name+"' style='z-index: "+self.zindex+";'  class='chunk speech-bubble' >"+self.data+"</div>";
        }
        return html;
    }
};

