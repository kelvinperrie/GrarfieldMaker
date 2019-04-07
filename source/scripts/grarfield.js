
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

});

var builder = function() {
    var self = this;

    self.htmlContainer = "#cartoon-container";
    self.availableChunkContainer = "#chunk-selector";
    self.availableChunks = [];
    self.chunkCounter = 0;
    self.showEditor = false;

    self.SetupPage = function() {
        // based on query string params, do we need to load some objects into the 'comic'
        var url = new URL(window.location.href);
        
        var editorRequired = url.searchParams.get("editorRequired");
        if(editorRequired == "true") {
            self.showEditor = true;
            self.OutputAvailableChunks(self.availableChunkContainer);
            $("#chunk-selector").show();
            $("#selected-toolbar").show();
            $("#editor-link").hide();
        }

        var persistance = url.searchParams.get("persist");
        if(persistance) {
            var jsonObject = JSON.parse(persistance);
            self.LoadPersistance(jsonObject);
        }


    }
    self.OutputAvailableChunks = function(container) {
        for(var i = 0; i < self.availableChunks.length; i++) {
            var selectable = "<div class='available-chunk' data-chunkname='"+self.availableChunks[i].name+"'><div class='chunk-data'>"+self.availableChunks[i].generateHtml()+"</div><div class='chunk-name'>"+self.availableChunks[i].name+"</div></div>"
            $(container).append(selectable);
        }
    }

    self.LoadPersistance = function(chunks) {
        console.log(chunks);
        for(var i=0; i < chunks.length; i++) {
            var newId = self.AddChunkToPage(chunks[i].name);
            $(newId).attr("style",chunks[i].style);
            if(chunks[i].text) {
                $(newId).text(chunks[i].text);
            }
        }
    }
    self.OpenForView = function() {
        var currentUrl = window.location.href.split('?')[0];
        var persistance = self.MakePersistance();
        var newUrl = currentUrl + "?persist=" + persistance
        window.open(newUrl,'_blank');
    }
    self.OpenForEditing = function() {
        var currentUrl = window.location.href.split('?')[0];
        var persistance = window.location.href.split('?')[1];
        var newUrl = currentUrl + "?editorRequired=true&" + persistance
        window.open(newUrl,"_self");
    }
    self.MakePersistance = function() {
        //?editorRequired=true&persist=%5B%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%20100;%20left:%20207px;%20top:%2042px;"%7D,%7B"name":"Bkgrnd%20greenish","style":"width:%20383px;%20height:%20329px;%20z-index:%2090;%20left:%20208px;%20top:%2041px;"%7D,%7B"name":"Grarfield%20looking%20right","style":"width:%20110px;%20height:%20140px;%20z-index:%20100;%20left:%20269px;%20top:%20185px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%2090;%20left:%20207px;%20top:%20322px;"%7D,%7B"name":"Talking%20bubble","style":"z-index:%20100;%20left:%20343px;%20top:%20104px;","text":"monday"%7D%5D
        //?persist=%5B%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%20100;%20left:%2045px;%20top:%2049px;"%7D,%7B"name":"Bkgrnd%20greenish","style":"width:%20383px;%20height:%20329px;%20z-index:%2090;%20left:%2044px;%20top:%2046px;"%7D,%7B"name":"Grarfield%20looking%20right","style":"width:%20110px;%20height:%20140px;%20z-index:%20100;%20left:%2073px;%20top:%20190px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%2090;%20left:%2046px;%20top:%20327px;"%7D,%7B"name":"Talking%20bubble","style":"z-index:%20100;%20left:%20130px;%20top:%20118px;","text":"monday"%7D,%7B"name":"Talk%20bubble%20spike%20left","style":"width:%2025px;%20height:%2026px;%20z-index:%20100;%20left:%20134px;%20top:%20156px;"%7D,%7B"name":"Joan%20looking%20left","style":"width:%20105px;%20height:%20201px;%20z-index:%20100;%20left:%20282px;%20top:%20129px;"%7D,%7B"name":"Bkgrnd%20yellowish","style":"width:%20383px;%20height:%20329px;%20z-index:%2090;%20left:%20441px;%20top:%2033px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%2090;%20left:%20438px;%20top:%20312px;"%7D,%7B"name":"Grarfield%20looking%20right","style":"width:%20110px;%20height:%20140px;%20z-index:%2090;%20left:%20482px;%20top:%20176px;"%7D,%7B"name":"Joan%20looking%20left","style":"width:%20105px;%20height:%20201px;%20z-index:%20100;%20left:%20656px;%20top:%20113px;"%7D,%7B"name":"Talking%20bubble","style":"z-index:%20100;%20left:%20592px;%20top:%2064px;","text":"Monday"%7D,%7B"name":"Talk%20bubble%20spike%20right","style":"width:%2025px;%20height:%2026px;%20z-index:%20100;%20left:%20639px;%20top:%20102px;"%7D,%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%2090;%20left:%20439px;%20top:%2032px;"%7D,%7B"name":"Bkgrnd%20greenish","style":"width:%20383px;%20height:%20329px;%20z-index:%2090;%20left:%20835px;%20top:%2055px;"%7D,%7B"name":"Frame","style":"width:%20383px;%20height:%20329px;%20z-index:%2090;%20left:%20832px;%20top:%2052px;"%7D,%7B"name":"Bench","style":"width:%20380px;%20height:%2048px;%20z-index:%2090;%20left:%20834px;%20top:%20330px;"%7D%5D
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

    self.AddChunkToPage = function(name) {
        self.chunkCounter++;
        var id = 'chunk' + self.chunkCounter;
        var html = self.GetChunkHtml(name, id);
        if(!html) return;

        $(self.htmlContainer).append(html);
        if(self.showEditor) {
            $("#" + id).draggable();
            $("#" + id).on('click', function(){
                self.MakeSelected($(this));
            });
            $("#" + id).on('dblclick', function(){
                if($(this).hasClass('speech-bubble')) {
                    // lol
                    var currentText = $("#" + id).html();
                    var text = window.prompt('Say what:', currentText);
                    $("#" + id).html(text);
                }
            });
        }
        return "#" + id;
    }
    self.GetChunkHtml = function(name, id) {
        for(var i = 0; i < self.availableChunks.length; i++) {
            if(name === self.availableChunks[i].name) {
                return self.availableChunks[i].generateHtml(id);
            }
        }
    }
    self.DeleteSelected = function() {
        $('.selected').remove();
    }
    self.MakeSelected = function(chunk) {
        self.ClearSelected();
        $(chunk).addClass('selected');
    }
    self.ClearSelected = function() {
        $("#cartoon-container .chunk").removeClass('selected');
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

    self.availableChunks.push(new chunk("image", "Frame","frame1.png",{ width: 383, height: 329 },100));
    self.availableChunks.push(new chunk("image", "Bench","bench1.png",{ width: 380, height: 48 },100));
    self.availableChunks.push(new chunk("image", "Bkgrnd yellowish","background1.png",{ width: 383, height: 329 },100));
    self.availableChunks.push(new chunk("image", "Bkgrnd greenish","background2.png",{ width: 383, height: 329 },100));
    self.availableChunks.push(new chunk("image", "Grarfield looking right","grarfield-right-upper.png",{ width: 110, height: 140 },150));
    self.availableChunks.push(new chunk("image", "Grarfield looking left","grarfield-left-upper.png",{ width: 110, height: 140 },150));
    self.availableChunks.push(new chunk("image", "Grarfield bed looking right","grarfield-bed-right.png",{ width: 209, height: 143 },150));
    self.availableChunks.push(new chunk("image", "Grarfield bed looking left","grarfield-bed-left.png",{ width: 209, height: 143 },150));
    self.availableChunks.push(new chunk("image", "Joan looking right","joan-right.png",{ width: 105, height: 201 },150));
    self.availableChunks.push(new chunk("image", "Joan looking left","joan-left.png",{ width: 105, height: 201 },150));
    self.availableChunks.push(new chunk("talking", "Talking bubble","Example text",{ width: 200, height: 200 },150));
    self.availableChunks.push(new chunk("image", "Talk bubble spike left","speech-from-left.png",{ width: 25, height: 26 },150));
    self.availableChunks.push(new chunk("image", "Talk bubble spike right","speech-from-right.png",{ width: 25, height: 26 },150));

};

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
            html = "<img id='"+self.id+"' data-name='"+self.name+"' src='images/"+self.data+"' alt='"+self.name+"' style='width: "+self.size.width+"px; height: "+self.size.height+"px; z-index: 100;'  class='chunk' />";
        } else if(self.type === 'talking') {
            html = "<div id='"+self.id+"' data-name='"+self.name+"' style='z-index: 100;'  class='chunk speech-bubble' >"+self.data+"</div>";
        }
        return html;
    }
};


(function ($) {

    $.fn.eightBallMe = function (settings) {

        // the id associated with our eightball
        var id = "my-eightball";

        // add the required elements
        $(this).append('<div class="eightball-moveable-area" id="' + id + '"><!--content = everything in the window of the ball--><div id="eightball-content"><!-- the animation while the ball is \'thinking\' --><div id="eightball-blur-container"></div><!-- the message to show the user --><div id="eightball-response"><div id="eightball-blue-thing-container"><img src="images/BlueBacking.png" alt="blue background" /></div><div id="eightball-message"></div></div></div><img src="images/BallBase.png" alt="ball base" /></div >');

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // tracks the status of 'thinking'; dragging, stopping, stopped,
        var status = "stopped";
        var possibleResponses = ["ANSWER UNCLEAR", "I HAVE NO IDEA", "IT MAY BE SO", "SO REALLY HARD TO KNOW"];

        // user jqueryui to make the ball draggable & link it to the events we need
        $("#" + id).draggable({
            start: function () {
                StartDragAnimation();
            },
            drag: function () {
            },
            stop: function () {
                StopDragAnimation();
            }
        });
        // triggered when the ball is started being dragged; initialises the animation
        function StartDragAnimation() {
            $("#eightball-response").stop().hide();
            status = "dragging";
            DoAnimation();
        }
        // triggered when the ball is stopped being dragged/moved
        function StopDragAnimation() {
            status = "stopping";
            // the animation doesn't finish as soon as they stop dragging, there is a delay
            setTimeout(function () { if (status === "stopping") status = "stopped"; }, 1000);
        }
        function DoAnimation() {
            if (status !== "stopped") {
                setTimeout(function () { DoAnimation(); }, 100);
            } else {
                ShowResponse();
            }
        }
        // outputs a response to the browser
        function ShowResponse() {
            var responseIndex = getRandomInt(0, possibleResponses.length - 1);
            $("#eightball-message").html(possibleResponses[responseIndex]);
            $("#eightball-response").stop().fadeTo(3000, 1);
        }

        // creates elements of the thinking animation
        var blobCount = 0;
        function MakeBlurBlobThing() {
            var maxWidth = 100;
            var maxHeight = 100;
            blobCount++;
            var id = 'blur' + blobCount;
            var top = getRandomInt(0, maxHeight);
            var left = getRandomInt(0, maxWidth);
            var fadeInTime = 1000;
            var fadeOutTime = 2000;
            $('#eightball-blur-container').append($('<div></div>')
                .attr({ id: id, style: 'top: ' + top + 'px; left: ' + left + 'px;' })
                .addClass("eightball-blur-blob")
            );
            $("#" + id).stop().fadeTo(fadeInTime, 1, function () { $("#" + id).stop().fadeTo(fadeOutTime, 0, function () { $('#' + id).remove(); }); });
        }

        // a loop that creates the thinking animation if the ball is being moved (or recently moved)
        function DoBlurBlobs() {
            if (status != "stopped") {
                MakeBlurBlobThing();
            }
            setTimeout(function () { DoBlurBlobs(); }, 200);
        }

        DoBlurBlobs();

        return this;
    };

}(jQuery));