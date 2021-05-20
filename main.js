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
var memCats = [];
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
setRandomTitle();
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
    case 0:
    if(getActiveSplits().length == 0){
      clearSplitButton();
    }
    break;
    case 2:
      if(getFullAmount() == 0) return;
      console.log('applying all to memcats');
      saveToMemcats();
    break;
    case 4:
      if(getActiveSplits().length == 0){
        clearSplitButton();
        return;
      }
      else{
        createFinalSplitElements();
        changeOverlay();
      }
    break;
    case 5:
      calculateCategories();
      if(formdata.categories.length == 0) return;
      s = 0;
    break;
  }
  window.screens.forEach((item, i) => {
    if(i != s) item.style.display = 'none';
  });
  window.screens[s].style.display = 'inline';
}
function calculateCategories(){
  let c = document.getElementsByClassName('split-final-cat');
  formdata.categories = [];
  for(let i = 0; i < c.length; i++){
    let cost = getAm(c[i].getAttribute('data-value'));
    if(c[i].style.display != 'none' && cost != 0){
      formdata.categories.push({
        name: c[i].querySelector('.cat-p').innerText,
        amount: cost,
        inflow: c[i].getAttribute('data-checked')=='true',
        gst: c[i].getAttribute('data-gst')=='true',
        memo: c[i].querySelector('.splitMemo').value
      });
    }
  }
  if(formdata.categories.length > 0) document.getElementById('splitCatButton').innerText = `Split (${formdata.categories.length})`;
  else clearSplitButton();
  document.getElementById('singleCatButton').innerText = `Single >`;
}
function clearSplitButton(){
  document.getElementById('splitCatButton').innerText = 'Split ✂️';
}
function saveToMemcats(){
  let c = document.getElementsByClassName('split-final-cat');
  for(let i = 0; i < c.length; i++){
    let cost = getAm(c[i].getAttribute('data-value'));
      if(c[i].querySelector('.cat-p').innerText != 'DEMO')
      memCats[c[i].querySelector('.cat-p').innerText]={
        name: c[i].querySelector('.cat-p').innerText,
        amount: cost,
        inflow: c[i].getAttribute('data-checked')=='true',
        gst: c[i].getAttribute('data-gst')=='true',
        memo: c[i].querySelector('.splitMemo').value
      };
  }
}
function generateCategories(){
  catsGenerated = true;
  singleCont.innerHTML = '';
  splitsCont.innerHTML = '';
  categories.forEach(item => {
    singleCont.appendChild(createSingleCat(item.itm));
    splitsCont.appendChild(createSplitCat(item.itm));
  });
}
function generatePayees(){
  payCont.innerHTML = '';
  payees.forEach(item => {
    payCont.appendChild(createPayee(item.itm));
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
    setPayee(t.querySelector('.cat-p').innerText);
    setScreen(0);
  }
}
function setPayee(text){
  formdata.payee = text;
  document.getElementById('payeeButton').innerText = formdata.payee;
  let g = payees.filter((item) => item.itm == formdata.payee);
  if(g.length > 0 && formdata.categories.length == 0 && g[0].po){
    setSingleCat(g[0].po);
  }
}
function toggleGST(t){
  console.log(t.getAttribute('data-gst'));
  t.parentElement.setAttribute('data-gst',t.parentElement.getAttribute('data-gst') != 'true');
  let oldV = Number(t.parentElement.querySelector('#partialAmount').value);
  if(t.parentElement.getAttribute('data-gst')=='true'){
    t.style.background = 'cadetblue';
    t.parentElement.querySelector('#partialAmount').value = (oldV*1.05).toFixed(2);
    t.parentElement.setAttribute('data-value',(oldV*1.05).toFixed(2));
  }else{
    t.style.background = '#ddd';
    t.parentElement.querySelector('#partialAmount').value = (oldV/1.05).toFixed(2);
    t.parentElement.setAttribute('data-value',(oldV/1.05).toFixed(2));
  }
}
function change(t){
  t.parentElement.setAttribute('data-checked',t.parentElement.getAttribute('data-checked') != 'true');
  setPlusMinusButtonState(t,t.parentElement.getAttribute('data-checked') == 'true');
  changeOverlay();
}
function setPlusMinusButtonState(element,t){
  if(t){
    element.style.background = '#4eaa4d';
    element.innerText = '+';
  }else{
    element.style.background = '#c00';
    element.innerText = '-';
  }
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
  document.getElementById('overlay-text').innerText = `Total: $${total.toFixed(2)}
Remaining: $${(-remain).toFixed(2)}`;
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
  if(memCats.hasOwnProperty(v)){
    e.querySelector('#partialAmount').value = memCats[v].amount==0?'':memCats[v].amount;
    setInout(e,memCats[v].inflow);
    e.querySelector('.splitMemo').value = memCats[v].memo;
    e.querySelector('#_gst').value = memCats[v].gst;
    setGSTele(e,memCats[v].gst);
    e.setAttribute('data-value',memCats[v].amount==0?'':memCats[v].amount);
  }
  return e;
}
function setGSTele(t,s){
  t.setAttribute('data-gst',s);
  if(t.getAttribute('data-gst')=='true'){
    t.querySelector('#_gst').style.background = 'cadetblue';
  }else{
    t.querySelector('#_gst').style.background = '#ddd';
  }
}
function setInout(e,v){
  e.setAttribute('data-checked',v);
  setPlusMinusButtonState(e.querySelector('#_inout'),v);
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
  setSingleCat(t.querySelector('.cat-p').innerText);
  let g = payees.filter((item) => item.po == formdata.categories[0].name);
  console.log(g);
  if(g.length > 0 && formdata.payee === undefined) setPayee(g[0].itm);
}
function setSingleCat(text){
  document.getElementById('singleCatButton').innerText = text;
  clearSplitButton();
  formdata.categories = [{name:text, amount: getFullAmount()}];
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
      formdata.categories[0].memo = document.getElementById('memo').value;
    }
    formdata.date = document.getElementById('date').value;
    submitToSheet();
    t.style.display = 'none';
  }
}
var state = false;
function submitToSheet(){
  //add a payee if it doesnt exist
  if(payees.filter((item) => item.itm == formdata.payee).length == 0){
    let insertIndex = payees.length+1;
    for(let i = payees.length-1; i >= 0; i--){
      if(formdata.payee.toLowerCase() < payees[i].itm.toLowerCase()){
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
    trans.push([date,formdata.payee,formdata.categories[i].name,formdata.categories[i].memo,outflow,inflow]);
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
  if(formdata.categories.length == 1) for(let i = 0; i < payees.length; i++){
    if(payees[i].itm == formdata.payee){
      insertCellsAt('Payees!B'+(i+2),[[formdata.categories[0].name]]);
    }
  }
}
function setRandomTitle(){
  const cornyTitles = ['YNUB Personal Finance', 'YNOB Persunel Finunce', 'Personal Fiancee', 'Y. N. U. B', 'Budgetenator 2000', 'SkinnerSellout.com', 'WhyNub?', 'You. Have. A. Budget.', 'Money Money Money', 'Y CLUB', 'WhyNeedABudget?', 'Ynuhb Inc', 'You know you need it', '💰'];
  const cornyMessages = ['Long time no see.. haha JK lol', 'AlWaYS WaTcHIng', "You still haven't payed me", "I love money", "Merry Christmas", "I'm lovin it", "Now available on DVD", 'OK Boomer', 'You have 3 more free submissions', 'PLEASE clean your fingers before using', "Ignore your credit score", "Don't be a Frugal Flamingo", "Last submission by Zhāng Wěi of China", "Your breakfast was too cheap yesterday", "...You are not a loan!", "It just makes sense", "Borrow money from pessimists, they don’t expect it back", "Nothing is foolproof to a talented fool", "it's a user error", "Why is money called dough? Because we all knead it", "What’s another name for long term investment? A failed short term investment!"];
  document.getElementById('title').innerHTML = cornyTitles[Math.floor(Math.random() * cornyTitles.length)];
  document.getElementById('subtitle').innerHTML = cornyMessages[Math.floor(Math.random() * cornyMessages.length)];
}
