
function ID(idName) {
    return document.getElementById(idName);
}



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

function findMatchingLinkIndex(url, list, discludeWildCards) {
    if(list == null)  { return -1; }
    
    for (var i = 0; i < list.length; i++)  {
        var wildCardCaseSolved = discludeWildCards != true || list[i].url.indexOf('*') == -1;
        var isAMatch = checkUrlForListItem(url, list[i].url);

        if(wildCardCaseSolved && isAMatch) {
            return i;  
        }
    }   
    return -1;
} 

function checkUrlForListItem(url, itemText) {
    if(url && itemText) {
        if(itemText.indexOf('*') == -1) {
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
        }
        else  {
            itemText = itemText.replace('*', ".*");
            itemText = itemText.replace('.', "\.");
            var rex = new RegExp(itemText, 'g');

            var out = url.search(rex) != -1;

            return out;
        }
    }
    

    return false;
}


function removeMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list, true);
    if(target != -1)  {  list.splice(target, 1);   return true;  }
    return false;
}  
///---------------------------------------------------------------




