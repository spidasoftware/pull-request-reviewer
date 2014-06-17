console.time("Total");
// ==UserScript==
// @name       Github Pull Request Reviewer by Jeremy Wentworth
// @namespace  http://spidasoftware.com/
// @version    0.1
// @description  Give some order to your pull request
// @match      https://github.com/*/*/pull/*
// @match      https://github.com/*/*/pulls
// @match      https://github.com/spidasoftware/*
// @match      https://github.com/orgs/spidasoftware/dashboard/pulls
// @match      https://github.com/organizations/spidasoftware/dashboard/pulls/private
// @copyright  2013+, Jeremy Wentworth (SPIDAWeb)
// @require http://code.jquery.com/jquery-latest.js
// @require http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @require //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js
// @require https://raw.githubusercontent.com/andris9/jStorage/master/jstorage.js
// ==/UserScript==
//var requestAnimationFrame = window.requestAnimationFrame;

console.time("Style");

var pathName = window.location.pathname;

$("#site-container").bind("DOMSubtreeModified", function() {
    $(".list-group-item-name").each(function(u, elementIterator7){
        var reposLink = $(elementIterator7).children().first().next();
        var pullLink = reposLink.next();
        reposLink.attr('href', pullLink.attr('href'));
    });
});

///////////////////////////////////////////////////////////////
// Style
///////////////////////////////////////////////////////////////
$(".container").width("93%");
$("#js-repo-pjax-container").width("80%");
$(".meta").css("padding","0px 10px");
$(".file").css("margin-bottom","3px");
//console.timeEnd("Style");

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
        $(".file.js-details-container").each(function(y, elementIterator6){
            var updatedTempChild = $(elementIterator6).children().first();
            var updatedDataPath = $(updatedTempChild).attr('data-path');
            $.jStorage.set(y, updatedDataPath);
        });
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
    $(".minibutton.tooltipped.tooltipped-s").each(function(i, elementIterator4){
            elementIterator4.target = "_blank";
    });
    console.timeEnd("View");

requestAnimationFrame(function() {
    console.time("View2");
    $(".minibutton.tooltipped.tooltipped-s").each(function(b, elementIterator5){
        if(elementIterator5.innerText === "View"){
            elementIterator5.innerText = "Open";
        }
    });
    console.timeEnd("View2");
});

    //Repository link doesn't open repository anymore, now opens pull request
    //console.log(parentForLinks);
$(".list-group-item-name").each(function(w, elementIterator3){
    var reposLink = $(elementIterator3).children().first().next();
    var pullLink = reposLink.next();
    reposLink.attr('href', pullLink.attr('href'));

});

console.timeEnd("Repo Link");

//File location abbreviated
    console.time("File Location");
    var arrayOfLocations = [];
$(".js-selectable-text").each(function(m, elementIterator) {
    var stringLength = elementIterator.innerText.length;        
    if(stringLength > 48){
            var start = stringLength - 45;
            arrayOfLocations[m] = "..." + elementIterator.innerText.substring(start, stringLength);
        }
    else{
        arrayOfLocations[m] = elementIterator.innerText;
    }
});
    console.timeEnd("File Location");

requestAnimationFrame(function() {
    console.time("File2");
    $(".js-selectable-text").each(function(v, elementIterator2) {
        elementIterator2.innerText = arrayOfLocations[v];
    });
    console.timeEnd("File2");
});

//jStorage
function getIndex(node){
    var fileElement2 = $("#files")[0];
    var childList = fileElement2.childNodes;
    var lengthOfFilesChildNodes = fileElement2.childNodes.length;
    var checkForId = false;
    var indexOfMatch = 0;
    var f = 0;
    while(!checkForId && f < lengthOfFilesChildNodes){ 
        if(node.id === childList[f].id){
            checkForId = true;
            indexOfMatch = f;
        }
       f++;
    }
    return indexOfMatch;
}

function jStorage(){
    console.time("jStorage");
    var fileElement = $("#files")[0];
    $(".file.js-details-container").each(function(outterCounter, outterStorageIteration){
        $(".file.js-details-container").each(function(innerCounter, innerStorageIteration){
            var tempChild = $(innerStorageIteration).children().first();
            var dataPath = $(tempChild).attr('data-path');
            var value = $.jStorage.get(outterCounter);
            if(dataPath === value){
                var fileIndex = getIndex(innerStorageIteration);
                var tempNode = fileElement.removeChild(fileElement.childNodes[fileIndex]);
                fileElement.appendChild(tempNode);
        }
    });
});
    console.timeEnd("jStorage");
}
requestAnimationFrame(jStorage);
console.timeEnd("Total");