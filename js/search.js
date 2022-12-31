var suggestions=document.getElementById('suggestions');var userinput=document.getElementById('userinput');document.addEventListener('keydown',inputFocus);function inputFocus(e){if(e.keyCode===191){e.preventDefault();userinput.focus();}
if(e.keyCode===27){userinput.blur();suggestions.classList.add('d-none');}}
document.addEventListener('click',function(event){var isClickInsideElement=suggestions.contains(event.target);if(!isClickInsideElement){suggestions.classList.add('d-none');}});document.addEventListener('keydown',suggestionFocus);function suggestionFocus(e){const focusableSuggestions=suggestions.querySelectorAll('a');const focusable=[...focusableSuggestions];const index=focusable.indexOf(document.activeElement);let nextIndex=0;if(e.keyCode===38){e.preventDefault();nextIndex=index>0?index-1:0;focusableSuggestions[nextIndex].focus();}
else if(e.keyCode===40){e.preventDefault();nextIndex=index+1<focusable.length?index+1:index;focusableSuggestions[nextIndex].focus();}}
(function(){var index=elasticlunr.Index.load(window.searchIndex);userinput.addEventListener('input',show_results,true);suggestions.addEventListener('click',accept_suggestion,true);function show_results(){var value=this.value.trim();var options={bool:"OR",fields:{title:{boost:2},body:{boost:1},}};var results=index.search(value,options);var entry,childs=suggestions.childNodes;var i=0,len=results.length;var items=value.split(/\s+/);suggestions.classList.remove('d-none');results.forEach(function(page){if(page.doc.body!==''){entry=document.createElement('div');entry.innerHTML='<a href><span></span><span></span></a>';a=entry.querySelector('a'),t=entry.querySelector('span:first-child'),d=entry.querySelector('span:nth-child(2)');a.href=page.ref;t.textContent=page.doc.title;d.innerHTML=makeTeaser(page.doc.body,items);suggestions.appendChild(entry);}});while(childs.length>len){suggestions.removeChild(childs[i])}}
function accept_suggestion(){while(suggestions.lastChild){suggestions.removeChild(suggestions.lastChild);}
return false;}
function makeTeaser(body,terms){var TERM_WEIGHT=40;var NORMAL_WORD_WEIGHT=2;var FIRST_WORD_WEIGHT=8;var TEASER_MAX_WORDS=30;var stemmedTerms=terms.map(function(w){return elasticlunr.stemmer(w.toLowerCase());});var termFound=false;var index=0;var weighted=[];var sentences=body.toLowerCase().split(". ");for(var i in sentences){var words=sentences[i].split(/[\s\n]/);var value=FIRST_WORD_WEIGHT;for(var j in words){var word=words[j];if(word.length>0){for(var k in stemmedTerms){if(elasticlunr.stemmer(word).startsWith(stemmedTerms[k])){value=TERM_WEIGHT;termFound=true;}}
weighted.push([word,value,index]);value=NORMAL_WORD_WEIGHT;}
index+=word.length;index+=1;}
index+=1;}
if(weighted.length===0){if(body.length!==undefined&&body.length>TEASER_MAX_WORDS*10){return body.substring(0,TEASER_MAX_WORDS*10)+'...';}else{return body;}}
var windowWeights=[];var windowSize=Math.min(weighted.length,TEASER_MAX_WORDS);var curSum=0;for(var i=0;i<windowSize;i++){curSum+=weighted[i][1];}
windowWeights.push(curSum);for(var i=0;i<weighted.length-windowSize;i++){curSum-=weighted[i][1];curSum+=weighted[i+windowSize][1];windowWeights.push(curSum);}
var maxSumIndex=0;if(termFound){var maxFound=0;for(var i=windowWeights.length-1;i>=0;i--){if(windowWeights[i]>maxFound){maxFound=windowWeights[i];maxSumIndex=i;}}}
var teaser=[];var startIndex=weighted[maxSumIndex][2];for(var i=maxSumIndex;i<maxSumIndex+windowSize;i++){var word=weighted[i];if(startIndex<word[2]){teaser.push(body.substring(startIndex,word[2]));startIndex=word[2];}
if(word[1]===TERM_WEIGHT){teaser.push("<b>");}
startIndex=word[2]+word[0].length;var re=/^[\x00-\xff]+$/
if(word[1]!==TERM_WEIGHT&&word[0].length>=12&&!re.test(word[0])){var strBefor=body.substring(word[2],startIndex);var strAfter=substringByByte(strBefor,12);teaser.push(strAfter);}else{teaser.push(body.substring(word[2],startIndex));}
if(word[1]===TERM_WEIGHT){teaser.push("</b>");}}
teaser.push("…");return teaser.join("");}}());function substringByByte(str,maxLength){var result="";var flag=false;var len=0;var length=0;var length2=0;for(var i=0;i<str.length;i++){var code=str.codePointAt(i).toString(16);if(code.length>4){i++;if((i+1)<str.length){flag=str.codePointAt(i+1).toString(16)=="200d";}}
if(flag){len+=getByteByHex(code);if(i==str.length-1){length+=len;if(length<=maxLength){result+=str.substr(length2,i-length2+1);}else{break}}}else{if(len!=0){length+=len;length+=getByteByHex(code);if(length<=maxLength){result+=str.substr(length2,i-length2+1);length2=i+1;}else{break}
len=0;continue;}
length+=getByteByHex(code);if(length<=maxLength){if(code.length<=4){result+=str[i]}else{result+=str[i-1]+str[i]}
length2=i+1;}else{break}}}
return result;}
function getByteByBinary(binaryCode){var byteLengthDatas=[0,1,2,3,4];var len=byteLengthDatas[Math.ceil(binaryCode.length/8)];return len;}
function getByteByHex(hexCode){return getByteByBinary(parseInt(hexCode,16).toString(2));}