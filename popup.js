
window.addEventListener("load", init, false);


//Seph Reed Copywrite
//January 2014
//This code retrieves the color codes for specific parts and them applies
//them to all elements listed under that part in elements_and_settings.json

///---------Include list_tools.js------------------------------
function Link(url)  {
   this.url = url;
   this.hits = 0;
}


function findMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list);
    if(target != -1)  {  return list[target];  }
    else return null;
}   

function findMatchingLinkIndex(url, list) {
    if(list == null)  { return -1; }
    
    for (var i = 0; i < list.length; i++)  {
        if(checkUrlForListItem(url, list[i].url) == true) {
            return i;  
        }
    }   
    return -1;
} 

function checkUrlForListItem(url, itemText) {
    var target_index = url.indexOf(itemText);

    //if the list url is found in this link
    if(target_index != -1) {

        //if it begins the link, good
        if(target_index == 0)
            return true;

        //if it is not prepended by a letter, character, or dash, it's not part of the domain name, good
        else {
            var prev_char = url.charAt(target_index - 1);
            var matches = prev_char.match(/[\w\n-]/g);
            if(matches == null)
                return true;
        }
    }  

    return false;
}


function removeMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list);
    if(target != -1)  {  list.splice(target, 1);   return true;  }
    return false;
}   
///---------------------------------------------------------------





function Button(id, offText, onText, sublistName)  {
    this.id = id;
    this.onText = onText;
    this.offText = offText;
    this.sublistName = sublistName;
    this.sublist = null;   
    this.element = null;
}


var blamButton = new Button("blam", "BLAM IT!", "UNBLAM IT", "black_list");
var highlightButton = new Button("highlight", "Highlight Site", "Unhighlight Site", "a_list");


// var black_list;
// var blam;
var current_site

function init() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        current_site = arrayOfTabs[0].url;


        chrome.storage.local.get('black_list', function(result){
            if(result.black_list != null)  {  blamButton.sublist = result.black_list;  }
            else {  blamButton.sublist = [];  }

            initButton(blamButton);
        });


        chrome.storage.local.get('a_list', function(result){
            if(result.a_list != null)  {  highlightButton.sublist = result.a_list;  }
            else {  highlightButton.sublist = [];  }

            initButton(highlightButton);
        });
      
    });

    var ln = document.getElementById("title_bar");
    var location = ln.href;
    ln.onclick = function () {  
        chrome.tabs.create({active: true, url: location});  };
}


function initButton(button)  {
    button.element = document.getElementById(button.id);

    updateButton(button, false);
    button.element.addEventListener("mousedown", function()  {
        updateButton(button, true);  
    });
    // button.element.onclick = function()  {
    //     updateButton(button, true);  }
}



function updateButton(button, withFlip)  {
    var linkIndex = findMatchingLinkIndex(current_site, button.sublist);
    console.log(linkIndex);

    var buttonOn = (linkIndex != -1);
    
    if(withFlip == true) {
        if(buttonOn == false)  {
            var link = new Link(getSiteName(current_site));  
            button.sublist.push(link);
        }
        else {  button.sublist.splice(linkIndex, 1);  }

        buttonOn = !buttonOn;

        if(button.sublistName == "black_list")  {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {updateBlam: buttonOn}, function(response) {});
            });
            chrome.storage.local.set({ 'black_list' : button.sublist  }, function() {});   }
        else {
            chrome.storage.local.set({ 'a_list' : button.sublist  }, function() {});   }  
    }

    if(buttonOn == true)  {
        button.element.className = "engaged_button";
        button.element.innerHTML = button.onText;  }
    else  {
        button.element.className = "";
        button.element.innerHTML = button.offText;  }
}






// var tlds = [".com", ".net", ".org", ".biz", ".name", ".info", ".edu", ".gov", ".ag"];
function getSiteName(url)  {
    console.log(url);
    // for (var i = 0; i < tlds.length; i++) {
    //     var target = url.indexOf(tlds[i]);
    //     if(target != -1)  {
    //         var output = url.substring(0, target+tlds[i].length);
    //         console.log("lalal");
    //         return output;
    //     }
    // }
    // return url;

    return url.match(/[\w-]+\.\w+(?=[\/\?\s]|$)/g)[0];
}






