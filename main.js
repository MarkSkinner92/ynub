var inout = document.getElementById('inout');
var cats = document.getElementById('cats');
var singleCont = document.getElementById('single-cats'),
    splitsCont = document.getElementById('split-cats'),
    splitsFinalCont = document.getElementById('split-final-cats'),
    payCont = document.getElementById('split-final-payees');
var singleClone = document.getElementById('single-cat'),
    splitsClone = document.getElementById('split-cat'),
    splitsFinalClone = document.getElementById('split-final-cat'),
    payeeFinalClone = document.getElementById('single-payee');
var formdata = {categories:[]};
var catsGenerated = false;
var mainInflow = false;
var transactions = [];
var months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
var categories = [];
var payees = [];
var today = new Date();
let todayDateFormated = (`${today.getFullYear()}-${(today.getMonth()+1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })}-${today.getDate().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })}`);
document.getElementById("date").value = todayDateFormated;
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
        changeOverlay();
      }
    break;
    case 5:
      calculateCategories();
      s = 0;
    break;
    case 3:
      generatePayees();
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
      formdata.categories.push({name:c[i].querySelector('.cat-p').innerText, amount: cost, inflow:c[i].getAttribute('data-checked')=='true'});
    }
  }
  document.getElementById('splitCatButton').innerText = `Split (${formdata.categories.length})`;
  document.getElementById('singleCatButton').innerText = `Single >`;
}
function generateCategories(){
  catsGenerated = true;
  singleCont.innerHTML = '';
  splitsCont.innerHTML = '';
  categories.forEach(item => {
    singleCont.appendChild(createSingleCat(item));
    splitsCont.appendChild(createSplitCat(item));
  });
}
function generatePayees(){
  payCont.innerHTML = '';
  payees.forEach(item => {
    payCont.appendChild(createPayee(item));
  });
}
function createPayee(item){
  let e = payeeFinalClone.cloneNode(true);
  e.querySelector('.cat-p').innerText = item;
  e.style.display = 'inline-block';
  return e;
}
function choosePayee(t){
  if(t.querySelector('.cat-p').innerText != ''){
    formdata.payee = t.querySelector('.cat-p').innerText;
    document.getElementById('payeeButton').innerText = formdata.payee;
    setScreen(0);
  }
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
  changeOverlay();
}
function changeValue(t){
  t.parentElement.setAttribute('data-value',t.value || 0);
  changeOverlay();
}
function changeOverlay(){
  let total = (getFullAmount() * (mainInflow?1:-1)), remain = 0;
  let c = document.getElementsByClassName('split-final-cat');
  for(let i = 0; i < c.length; i++){
    let cost = getAm(c[i].getAttribute('data-value'));
    if(c[i].style.display != 'none' && cost != 0){
      remain += cost*(c[i].getAttribute('data-checked')=='true'?1:-1)
    }
  }
  remain -= total;
  document.getElementById('overlay-text').innerText = `Total: $${total}, Remaining: $${-remain}`;
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
  document.getElementById('singleCatButton').innerText = formdata.categories[0].name;
  document.getElementById('splitCatButton').innerText = 'Split ✂️';
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
function searchForPayee(t){
  document.getElementById('payee-addition').querySelector('.cat-p').innerText = t.value;
  searchElements(document.getElementsByClassName('single-payee'),t.value);
}
function searchForSingle(t){
  searchElements(document.getElementsByClassName('single-cat'),t.value);
}
function searchForCat(t){
  searchElements(document.getElementsByClassName('split-cat'),t.value);
}
function searchElements(a,b){
  for(let i = 0; i < a.length; i++){
    if(a[i].querySelector('.cat-p').innerText.toLowerCase().includes(b.toLowerCase())) a[i].style.display = 'inline-block';
    else a[i].style.display = 'none';
  }
}
function submit(t){
  if(formdata.categories.length > 0 && getFullAmount() != 0 && formdata.payee && gapi.auth2.getAuthInstance().isSignedIn.get()){
    if(formdata.categories.length == 1){
      formdata.categories[0].amount = getFullAmount();
      formdata.categories[0].inflow = mainInflow;
    }
    formdata.memo = document.getElementById('memo').value;
    formdata.date = document.getElementById('date').value;
    submitToSheet();
    t.style.display = 'none';
  }
}
var state = false;
function submitToSheet(){
  if(!payees.includes(formdata.payee)){
    let insertIndex = payees.length+1;
    for(let i = payees.length-1; i >= 0; i--){
      if(formdata.payee.toLowerCase() < payees[i].toLowerCase()){
        insertIndex = i+1;
      }
    }
    insertRowAt(insertIndex,[[formdata.payee]],1823492813);
  }
  let dates = document.getElementById('date').value.split('-');
  var date = (months[parseInt(dates[1])-1]+' ' + parseInt(dates[2]) + ", " + dates[0]);

  var trans = [];
  for(let i = 0; i < formdata.categories.length; i++){
    console.log(formdata.categories);
    var inflow =  formdata.categories[i].amount;
    var outflow = formdata.categories[i].amount;
    if(formdata.categories[i].inflow){
      outflow = '';
    }else{
      inflow = '';
    }
    trans.push([date,formdata.payee,formdata.categories[i].name,formdata.memo,outflow,inflow]);

  }
  console.log(trans);
  let insertIndex = transactions.length+4;
  let uns = convertTime(date);
  for(let i = transactions.length-1; i >= 0; i--){
    if(convertTime(date) >= transactions[i]){
      insertIndex = i+4;
    }
  }
  insertRowAt(insertIndex,trans,1871586694,true);
}
