console.time("Total");
// ==UserScript==
// @name       Github Pull Request Reviewer by Jeremy Wentworth
// @namespace  http://spidasoftware.com/
// @version    0.1
// @description  Give some order to your pull request
// @match      https://github.com/*/*/pull/*
// @match      https://github.com/*/*/pulls
// @match      https://github.com/spidasoftware/*
// @copyright  2013+, Jeremy Wentworth (SPIDAWeb)
// @require http://code.jquery.com/jquery-latest.js
// @require http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @require //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js
// @require https://raw.githubusercontent.com/andris9/jStorage/master/jstorage.js
// ==/UserScript==
var requestAnimationFrame = window.requestAnimationFrame;

console.time("Style");
///////////////////////////////////////////////////////////////
// Style
///////////////////////////////////////////////////////////////
$(".container").width("80%");
var sideBar = document.getElementsByClassName("repository-sidebar clearfix");
sideBar[0].style.width = "17%";
$("#js-repo-pjax-container").width("80%");
$(".meta").css("padding","0px 10px");
$(".file").css("margin-bottom","3px");
console.timeEnd("Style");

///////////////////////////////////////////////////////////////
// DnD Sort
///////////////////////////////////////////////////////////////
$("#files").sortable({
    cursor: "move",
    handle: ".handle",
    start: function( event, ui ) {},
    stop: function( event, ui ) {
        console.time("Event");
        $.jStorage.flush();
        var list = document.getElementsByClassName("file js-details-container");
        var length6 = list.length;
        var x = 0;
        for(var y =0; y < length6; y++){
            var tempId = list[y].id;
            if(tempId.indexOf("diff") >= 0){
                $.jStorage.set(x, tempId);
                x++;
            }
        }
        console.timeEnd("Event");
    }
});

console.time("Toggle Data");
///////////////////////////////////////////////////////////////
// Toggle data view for all files
///////////////////////////////////////////////////////////////
$('<a>',{
    text: 'Show Data',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'Show Data',
    href: '#',
    click: function(){ 
        $(".data").show()
    }
}).insertBefore($(".show-diff-stats"));

$('<a>',{
    text: 'Hide Data',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'File Data',
    href: '#',
    click: function(){ 
        $(".data").hide()
    }
}).insertBefore($(".show-diff-stats"));
console.timeEnd("Toggle Data");

console.time("Buttons");
///////////////////////////////////////////////////////////////
// Buttons for each file
///////////////////////////////////////////////////////////////
var bodyTag = $('body');
var filesContainer = $("#files");
$(".file").each(function(){
    var fileDiv = $(this);
    var actionsDiv = fileDiv.find(".actions");
    var dataDiv = fileDiv.find(".data");
    
    $('<a>',{
        text: 'Show',
        class: 'minibutton',
        style: '',
        title: 'Toggle',
        href: '#',
        click: function(){ 
            dataDiv.toggle();
            return false;
        }
    }).appendTo(actionsDiv);
    
    $('<a>',{
        text: 'Top',
        class: 'minibutton',
        style: '',
        title: 'Moves File to Top',
        href: '#',
        click: function(){ 
            fileDiv.detach(); 
            filesContainer.prepend(fileDiv);
            return false;
        }
    }).appendTo(actionsDiv);
    
    $('<a>',{
        text: 'Bottom',
        class: 'minibutton',
        style: '',
        title: 'Moves File to Bottom',
        href: '#',
        click: function(){ 
            fileDiv.detach(); 
            filesContainer.append(fileDiv);
            return false;
        }
    }).appendTo(actionsDiv);
 
    $('<div>',{
        text: '☰',
        class: 'handle',
        style: '',
        style: 'font-size:20px; display: inline-block; line-height:20px; padding-left:10px; cursor:move;'
    }).appendTo(actionsDiv);
    
});
console.timeEnd("Buttons");

    //Change "View" button to "Open" and now opens in new tab
    console.time("View");
    var view1 = document.getElementsByClassName("minibutton tooltipped tooltipped-s");
    var length = view1.length;
    for(var i = 0; i < length; i++){
            view1[i].target = "_blank";
    }
    console.timeEnd("View");

requestAnimationFrame(function() {
    console.time("View2");
    for(var b = 0; b < length; b++){
        if(view1[b].innerText === "View"){
            view1[b].innerText = "Open";
        }
    }
    console.timeEnd("View2");
});

    console.time("Repo Link");
    //Repository link doesn't open repository anymore, now opens pull request
    var mainRepo = document.getElementsByClassName("js-navigation-open");
    var length2 = mainRepo.length;
    var pullLink = document.getElementsByClassName("css-truncate css-truncate-target");
    var j = 0;
for(var k = 0; k < length2; k++){
    if(mainRepo[k].className === "js-navigation-open"){
        var tempLink = mainRepo[k].href;
        var childList = pullLink[j].getElementsByTagName("a");
        childList[0].href = tempLink;
        j++;
    }
}
console.timeEnd("Repo Link");

//File location abbreviated
    console.time("File Location");
    var text = document.getElementsByClassName("js-selectable-text");
    var length4 = text.length;
    var text1 = [];
for(var m = 0; m < length4; m++){
    var stringLength = text[m].innerText.length;        
    if(stringLength > 75){
            var start = stringLength - 72;
            text1[m] = "..." + text[m].innerText.substring(start, stringLength);
        }
    else{
        text1[m] = text[m].innerText;
    }
}
    console.timeEnd("File Location");

requestAnimationFrame(function() {
    console.time("File2");
    for(var v = 0; v < length4; v++){
        text[v].innerText = text1[v];
    }
    console.timeEnd("File2");
});

//jStorage
function getIndex(node){
    var fileElement2 = document.getElementById("files");
    var childList = fileElement2.childNodes;
    var length9 = fileElement2.childNodes.length;
    var check2 = false;
    var index = 0;
    var f = 0;
    while(!check2 && f < length9){ 
        if(node.id === childList[f].id){
            check2 = true;
            index = f;
        }
       f++;
    }
    return index;
}

function jStorage(){
    console.time("jStorage");
    var list = document.getElementsByClassName("file js-details-container");
    var fileElement = document.getElementById("files");
    var length5 = list.length;
for(var q = 0; q < length5; q++){
    for(var p = 0; p < length5; p++){
        var tempId2 = list[p].id;
        var value = $.jStorage.get(q);
        if(tempId2 === value){
            var fileIndex = getIndex(list[p]);
            var tempNode = fileElement.removeChild(fileElement.childNodes[fileIndex]);
            fileElement.appendChild(tempNode);
        }
    }
}
    console.timeEnd("jStorage");
}
requestAnimationFrame(jStorage);
console.timeEnd("Total");