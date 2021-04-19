var inout = document.getElementById('inout');
var cats = document.getElementById('cats');
var singleCont = document.getElementById('single-cats'),
    splitsCont = document.getElementById('split-cats'),
    splitsFinalCont = document.getElementById('split-final-cats');
var singleClone = document.getElementById('single-cat'),
    splitsClone = document.getElementById('split-cat'),
    splitsFinalClone = document.getElementById('split-final-cat');
var formdata = {};
var catsGenerated = false;
var mainInflow = false;
window.screens = [document.getElementById('MainScreen'),document.getElementById('SingleCategory'),document.getElementById('SplitCategories'),document.getElementById('Payees'),document.getElementById('Splits')];
function toggleInOut(){
  if(mainInflow){
    setFundOut();
  }else{
    setFundIn();
  }
}
function setFundIn(){
  inout.style.background = '#4eaa4d';
  inout.innerText = '+';
  mainInflow = true;
}
function setFundOut(){
  inout.style.background = '#c00';
  inout.innerText = '-';
  mainInflow = false;
}
function setScreen(s){
  switch(s){
    case 2:
      if(getFullAmount() == 0) return;
    case 1:
      if(!catsGenerated) generateCategories();
    break;
    case 4:
      if(getActiveSplits().length == 0) return;
      else{
        createFinalSplitElements();
      }
    break;
    case 5:
      calculateCategories();
      s = 0;
    break;
  }
  window.screens.forEach((item, i) => {
    if(i != s) item.style.display = 'none';
  });
  window.screens[s].style.display = 'inline';
}
function calculateCategories(){
  formdata.categories = [];
  let c = document.getElementsByClassName('split-final-cat');
  for(let i = 0; i < c.length; i++){
    let cost = getAm(c[i].getAttribute('data-value'));
    if(c[i].style.display != 'none' && cost != 0){
      formdata.categories.push({name:c[i].querySelector('.cat-p').innerText, amount: cost, inflow:c[i].getAttribute('data-checked')});
    }
  }
}
function generateCategories(){
  catsGenerated = true;
  var categories = ['wow wow wow this is  at weawd awef wow wow wow this is  at weawd awef wow wow wow this is  at weawd awef wow wow wow this is  at weawd awef wow wow wow this is  at weawd awef ','b','c','1','2','3'];

  singleCont.innerHTML = '';
  splitsCont.innerHTML = '';
  categories.forEach(item => {
    singleCont.appendChild(createSingleCat(item));
    splitsCont.appendChild(createSplitCat(item));
  });
}
function change(t){
  t.parentElement.setAttribute('data-checked',t.parentElement.getAttribute('data-checked') != 'true');
  if(t.parentElement.getAttribute('data-checked') == 'true'){
    t.style.background = '#4eaa4d';
    t.innerText = '+';
  }
  else{
    t.style.background = '#c00';
    t.innerText = '-';
  }
}
function changeValue(t){
  t.parentElement.setAttribute('data-value',t.value);
}
function createSplitCat(v){
  let e = splitsClone.cloneNode(true);
  e.querySelector('.cat-p').innerText = v;
  e.style.display = 'inline-block';
  return e;
}
function createSingleCat(v){
  let e = singleClone.cloneNode(true);
  e.querySelector('.cat-p').innerText = v;
  e.style.display = 'inline-block';
  return e;
}
function createSplitFinalCat(v){
  let e = splitsFinalClone.cloneNode(true);
  e.querySelector('.cat-p').innerText = v;
  e.style.display = 'inline-block';
  return e;
}
function createFinalSplitElements(){
  splitsFinalCont.innerHTML = '';
  let cs = getActiveSplits();
  cs.forEach(item => {
    splitsFinalCont.appendChild(createSplitFinalCat(item));
  });
}
function getFullAmount(){
  return getAm(document.getElementById('fullAmount').value);
}
function getAm(v){
  return Math.abs(parseFloat(v)) || 0;
}
function clickSingleCat(t){
  setScreen(0);
  formdata.categories = [{name:t.querySelector('.cat-p').innerText, amount: getFullAmount()}];
}
function getActiveSplits(){
  let c = document.getElementsByClassName('split-cat');
  let d = [];
  for(let i = 0; i < c.length; i++){
    let item = c[i];
    if(item.style.display != 'none' && item.getAttribute('data-checked') == 'true'){
      d.push(item.querySelector('.cat-p').innerText);
    }
  }
  return d;
}
function checkSplitCat(t){
  t.setAttribute('data-checked',t.getAttribute('data-checked') != 'true');
}
function submit(){
  if(formdata.categories){
    if(formdata.categories.length == 1){
      formdata.categories[0].amount = getFullAmount();
      formdata.categories[0].inflow = mainInflow;
    }
    formdata.memo = document.getElementById('memo').value;
    console.log(formdata);
  }
}
