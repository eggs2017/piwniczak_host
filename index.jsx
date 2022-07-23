
//import * as tool from './tools.js'

function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

String.prototype.replaceAt=function(index, char) {
  var a = this.split("");
  a[index] = char;
  return a.join("");
}


function saveJSON(data, filename){

    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) filename = 'piwniczak.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function isEmpty(value){
 return (value == null || value.length === 0);
}

function showDate(){
 var date = new Date(),
   str = date.toUTCString();

 return str;
}


var orig = console.log;

function ExtConsole() {
var msgs = [];

while(arguments.length) {
   msgs.push("[" + showDate() + "]" + ': ' + [].shift.call(arguments));
}

orig.apply(console, msgs);
};


console.log = ExtConsole;

class SettingsForm extends React.Component {

constructor(props) {
   super(props);
 }

 render() {
     let settings = this.props.items;
     let editDiv = (this.props.editMode ? <span class="uk-badge uk-text-bold" uk-icon="file-edit" type="button">Edytuj</span> : '');
   return (

       <div class="uk-inline">
           {editDiv}
           {
                this.props.editMode  ?
                   <div uk-drop="mode: click">
                        <form class="uk-background-muted uk-form uk-margin" >

                             <div class="uk-margin">
                               <label class="uk-form-label" for="form-horizontal-text">Nazwa Urzadzenia: </label>
                               <div class="uk-form-controls">
                                   <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj nazwę.." name ="name" value={settings.name} onChange={() => this.props.eventChangeItem()}/>
                               </div>
                             </div>

                             <div class="uk-margin">
                               <label class="uk-form-label" for="form-horizontal-text">Tryb Eco: </label>
                               <div class="uk-form-controls">
                                   <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..tryb Eco, wpisz co ile minut należy wykonac zadania .." name ="ecoMode" value={settings.ecoMode} onChange={() => this.props.eventChangeItem()}/>
                               </div>
                             </div>

                               <div class="uk-margin">
                                 <label class="uk-form-label" for="form-horizontal-text">Serwer Mqtt: </label>
                                 <div class="uk-form-controls">
                                     <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj ip.." name="mqtt_server" value={settings.mqtt_server} onChange={() =>this.props.eventChangeItem()}/>
                                 </div>
                             </div>

                             <div class="uk-margin">
                               <label class="uk-form-label" for="form-horizontal-text">Port Mqtt: </label>
                               <div class="uk-form-controls">
                                   <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj port.." name="mqtt_port_mqtt" value={settings.mqtt_port_mqtt} onChange={ () => this.props.eventChangeItem()}/>
                               </div>
                           </div>

                           <div class="uk-margin">
                             <label class="uk-form-label" for="form-horizontal-text">Port Mqtt WS: </label>
                             <div class="uk-form-controls">
                                 <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj port.." name="mqtt_port_ws" value={settings.mqtt_port_ws} onChange={() => this.props.eventChangeItem()}/>
                             </div>
                           </div>
                         </form>
                   </div>
                   : ''

           }
       </div>

   );
 }
}



class ProgramForm extends React.Component{
 constructor(props) {
   super(props);

   this.state = {
     value : undefined
   };
 }

 render() {
   //choose icon
   let checked = false
   if(this.props.value.armed != undefined ){
     if(this.props.value.armed == 1)
      checked = true;
   }

   
  
   let defaultActionCommand = "";
   let ruleDevice1 = (this.props.value.rule != undefined && this.props.value.rule.length > 0? 
            this.props.value.rule[0].device : undefined);

   if(ruleDevice1 != undefined && ruleDevice1 != ""){
     //try find port
     let port = undefined;

     for(var device of this.props.devices){
         if(device.code == ruleDevice1){
           port =  device.port;
           defaultActionCommand = ("Thermometer"  == device.type ? "Measure" : "TurnOn");
           break;
         }
     }
   }

   let vals = []
   vals.push(<option label=""></option>);

   for(var device of this.props.devices){
       vals.push( <option value={device.code} >{device.code}</option> );
   }
   let deviceMap = React.Children.toArray(vals);


   let acts = [];
   acts.push(<option label=""></option>);
   acts.push(<option value="Measure">Pomiar</option>);
   acts.push(<option value="TurnOn">Włączenie</option>);
   acts.push(<option value="TurnOff">Wyłączenie</option>);
   let actsMap = React.Children.toArray(acts);

   return(

     <div>
       <div class="uk-inline">
           <span class="uk-badge" uk-icon="file-edit" type="button">Edytuj</span>
           <div uk-drop="mode: click"> 
                <div class="uk-card uk-card-large uk-card-default">
                
                <div class="uk-drop-grid uk-child-width-1-1@m" uk-grid>

                     <div class="uk-card-header">
                          <div class="uk-margin">
                            
                            <label class="uk-form-label" for="form-horizontal-text">Kod: </label>
                            <div class="uk-form-controls">
                                <input class="uk-input uk-margin-left uk-margin-bottom" id="form-horizontal-text" type="text"
                                        name ="code"
                                        value={this.props.value.code}
                                        keyRow = {this.props.value.code}
                                        onChange={() => this.props.handleChange()}/>
                            </div>
                          </div>

                          <div class="uk-margin">
                              <label class="uk-form-label" for="form-horizontal-text">Czas: </label>
                              <div class="uk-form-controls">
                                  <input class="uk-input uk-margin-left uk-margin-bottom"  id="form-horizontal-text" type="text" placeholder="..podaj czas aktywacji.."
                                      name="time"
                                      value={this.props.value.time}
                                      keyRow = {this.props.value.code}
                                      onChange={() => this.props.handleChange()}/>
                              </div>

                          </div>

                          <div class="uk-margin">
                            <label class="uk-form-label uk-margin-bottom" for="form-horizontal-text">Dni pracy: </label>
                            <WeekBadgeComponent dataParent = {this} days = {this.props.value.days} mode='edit'  />
                          </div>
                     </div>

                       <RuleRowsComponent  
                          keyRow = {this.props.value.code}  
                          rules= {this.props.value.rule}  
                          deviceMap = {deviceMap}  
                          handleChange  = { () => this.props.handleChange(event) }
                          handleRemove = { () => this.props.handleRemoveRule(event) }
                          handleAdd = { () => this.props.handleAddRule(event) }
                          />

                       <label class="uk-form-label" for="form-horizontal-text">Akcja#1: </label>
                       <fieldset>
                          <div class="uk-margin">
                          <label class="uk-form-label" for="form-horizontal-text">Urzadzenie: </label>
                            <select class="uk-select"
                                      tag = "action"
                                      name="device"
                                      keyRow = {this.props.value.code}
                                      onChange={() => this.props.handleChange()}
                                      value={(this.props.value.action != undefined ? this.props.value.action[0].device : "")}
                                    >
                                {deviceMap}
                            </select>
                          </div>
                          <div class="uk-margin">
                              <label class="uk-form-label" for="form-horizontal-text">Polecenie: </label>
                              <div class="uk-form-controls">
                                  <select class="uk-select"
                                            tag = "action"
                                            name="command"
                                            keyRow = {this.props.value.code}
                                            onChange={() => this.props.handleChange()}
                                            value={(this.props.value.action != undefined ? this.props.value.action[0].command : defaultActionCommand)}
                                          >
                                      {actsMap}
                                  </select>
                              </div>
                          </div>
                          <div class="uk-margin">
                            <label class="uk-form-label" for="form-horizontal-text">Mqtt: </label>
                            <div class="uk-form-controls">
                                <input class="uk-input uk-margin-bottom" id="form-horizontal-text" type="text"
                                name ="mqtt_topic"
                                value={this.props.value.mqtt_topic}
                                keyRow = {this.props.value.code}
                                onChange={() => this.props.handleChange()}/>
                            </div>
                          </div>
                       </fieldset>
                

                 </div>
                 </div>
           </div>
       </div>
       <div class="uk-inline">
           <span class="uk-badge" uk-icon="trash" code = {this.props.value.code} type="button" onClick={() => this.props.handleRemove()} >Usuń</span>
       </div>
     </div>
   )
 }

}
class DeviceForm extends React.Component {
 constructor(props) {
   super(props);
 }

 render() {

   let onOffDiv = (
     <div>
       <div class="uk-margin">
           <label class="uk-form-label" for="form-horizontal-text">Wartość włączenia </label>
           <div class="uk-form-controls">
               <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj wartość włączenia.."
                     name="OnValue"
                     value={this.props.device.OnValue}
                     keyRow = {this.props.device.code}
                     onChange={() => this.props.handleChange()}/>
           </div>
       </div>

       <div class="uk-margin">
           <label class="uk-form-label" for="form-horizontal-text">Wartość wyłączenia </label>
           <div class="uk-form-controls">
               <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj wartość wyłączenia.."
                       name="OffValue"
                       value={this.props.device.OffValue}
                       keyRow = {this.props.device.code}
                       onChange={() => this.props.handleChange()}/>
           </div>
       </div>
     </div>
   )


   if(this.props.device.type == "Thermometer"){
     onOffDiv = "";
   }


   let items = [];
   items.push(<option label=""></option>);
   items.push(<option value="Thermometer">Termometr</option>);
   items.push(<option value="Relay">Bramka</option>);


   let itemsMap = React.Children.toArray(items);

   return (
       <div>
         <div class="uk-inline">
             <span class="uk-badge" uk-icon="file-edit" type="button">Edytuj</span>
             <div uk-drop="mode: click">
                  <form class="uk-background-muted uk-form uk-margin" >
                       <div class="uk-margin">
                         <label class="uk-form-label" for="form-horizontal-text">Kod: </label>
                         <div class="uk-form-controls">
                             <input class="uk-input" id="form-horizontal-text" type="text"
                                   name ="code"
                                   value={this.props.device.code}
                                   keyRow = {this.props.device.code}
                                   onChange={() => this.props.handleChange()}/>
                         </div>
                       </div>

                       <div class="uk-margin">
                           <label class="uk-form-label" for="form-horizontal-text">Port: </label>
                           <div class="uk-form-controls">
                               <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj port.."
                                     name="port"
                                     value={this.props.device.port}
                                     keyRow = {this.props.device.code}
                                     onChange={() => this.props.handleChange()}/>
                           </div>
                       </div>

                       <div class="uk-margin">
                           <label class="uk-form-label" for="form-horizontal-text">Typ: </label>
                           <div class="uk-form-controls">
                               <select class="uk-select"
                                         name="type"
                                         keyRow = {this.props.device.code}
                                         onChange={() => this.props.handleChange()}
                                         value={this.props.device.type}
                                       >
                                   {itemsMap}
                               </select>
                           </div>
                       </div>

                       {onOffDiv}

                      <div class="uk-margin">
                         <label class="uk-form-label" for="form-horizontal-text">Mqtt: </label>
                         <div class="uk-form-controls">
                             <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj mqtt.."
                                   name="mqtt_topic"
                                   value={this.props.device.mqtt_topic}
                                   keyRow = {this.props.device.code}
                                   onChange={() => this.props.handleChange()}/>
                         </div>
                      </div>

                      <div class="uk-margin">
                           <label class="uk-form-label" for="form-horizontal-text">Domoticz Idx: </label>
                           <div class="uk-form-controls">
                               <input class="uk-input" id="form-horizontal-text" type="text" placeholder="..podaj domoticz id opcjonalnie.."
                                     name="domoticzIdx"
                                     value={this.props.device.domoticzIdx}
                                     keyRow = {this.props.device.code}
                                     onChange={() => this.props.handleChange()}/>
                           </div>
                       </div>
                   </form>
             </div>

         </div>
         <div class="uk-inline">
             <span class="uk-badge" uk-icon="trash" type="button" code = {this.props.device.code} onClick={() => this.props.removeItem()} >Usuń</span>
         </div>
       </div>
   );
 }
}

class LinkRuleComponent extends React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    var operatorList = []
    operatorList.push(<option label=""></option>);
    
    operatorList.push(<option value="AND">AND</option>);
    operatorList.push(<option value="OR">OR</option>);
    this.props.operatorMap = React.Children.toArray(operatorList);

    return(
      
      <fieldset  class="uk-margin uk-tile-dotted-green">
         <label class="uk-form-label" for="form-horizontal-text">Operator połaczeniowy: </label>

          <select class="uk-select"
                  tag = "rule"
                  name="linkOperator"
                  keyRow = {this.props.keyRow}
                  index = {this.props.ruleIndex}
                  onChange={() => this.props.handleChange()}
                  value={(this.props.rule != undefined ? this.props.rule.linkOperator : '<')}
                >
                {this.props.operatorMap}
          </select>
      </fieldset>
    )
  }
}

class RuleRowComponent extends React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    var operatorList = []
    operatorList.push(<option label=""></option>);
    
    operatorList.push(<option value=">">&gt;</option>);
    operatorList.push(<option value="<">&lt;</option>);
    operatorList.push(<option value="=">=</option>);
  
    this.props.operatorMap = React.Children.toArray(operatorList);

      return(
        <fieldset class="uk-margin ">

            <label class="uk-form-label" for="form-horizontal-text">Urzadzenie: </label>
            <select class="uk-select"
                        tag = "rule"
                        name="device"
                        keyRow = {this.props.keyRow}
                        index = {this.props.ruleIndex}
                        onChange={() => this.props.handleChange()}
                        value={(this.props.rule != undefined ? this.props.rule.device : "")}
                      >
                      {this.props.deviceMap}
            </select>
        
            <label class="uk-form-label" for="form-horizontal-text">Operator: </label>
            <select class="uk-select"
                    tag = "rule"
                    name="operator"
                    keyRow = {this.props.keyRow}
                    index = {this.props.ruleIndex}
                    onChange={() => this.props.handleChange()}
                    value={(this.props.rule != undefined ? this.props.rule.operator : '<')}
                  >
                  {this.props.operatorMap}
            </select>

          <label class="uk-form-label" for="form-horizontal-text">Oczekiwana wartość: </label>
          <div class="uk-form-controls">
              <input class="uk-input t uk-margin-bottom" id="form-horizontal-text" type="text"
                tag = "rule"
                name ="targetValue"
                keyRow = {this.props.keyRow}
                index = {this.props.ruleIndex}
                onChange={() => this.props.handleChange()}
                value={(this.props.rule != undefined ? this.props.rule.targetValue : "")}
              />
          </div>

          <label class="uk-form-label" for="form-horizontal-text">delta: </label>
          <div class="uk-form-controls">
              <input class="uk-input uk-margin-bottom" id="form-horizontal-text" type="text"
                name ="delta"
                tag = "rule"
                keyRow = {this.props.keyRow}
                index = {this.props.ruleIndex}
                onChange={() => this.props.handleChange()}
                value={(this.props.rule != undefined ? this.props.rule.delta : "")}
              />
          </div>
        </fieldset>
      )
    
  }
}


class RuleRowsComponent extends React.Component{

  constructor(props) {
    super(props);
  }

  renderLink(rule, ruleIndex){
      return(
          <LinkRuleComponent 
          keyRow  = {this.props.keyRow}  
          rule    = {rule}
          ruleIndex = {ruleIndex}
          handleChange  = { () => this.props.handleChange(event) }
        /> 
      )
  }

  renderRule(rule, ruleIndex){
    return(
          <RuleRowComponent   
              keyRow  = {this.props.keyRow}  
              rules   = {this.props.rules}
              rule    = {rule}
              ruleIndex = {ruleIndex}
              deviceMap = {this.props.deviceMap}  //dict
              handleChange  = { () => this.props.handleChange(event)}
        />
    )
  }
   
  renderRuleRow(rule, ruleIndex){
    if(ruleIndex == this.props.rules.length -1)
      return(
        <div class="uk-tile-dotted-green">
          <legend class="uk-form-label" for="form-horizontal-text">Reguła#: {ruleIndex+1}</legend>
          <span class="uk-icon" uk-icon="minus-circle"  
            programCode = {this.props.keyRow} 
            ruleIndex = {ruleIndex} 
            onClick={(e) => this.props.handleRemove(e)}></span>

          {this.renderRule(rule, ruleIndex)}
          
        </div>
      )
    else
      return(
        <div>
          <div class="uk-tile-dotted-green">
            <legend class="uk-form-label" for="form-horizontal-text">Reguła#: {ruleIndex+1}</legend>
            <span class="uk-icon" uk-icon="minus-circle"  
                    programCode = {this.props.keyRow} 
                    ruleIndex = {ruleIndex} 
                    onClick={(e) => this.props.handleRemove(e)} ></span>

            {this.renderRule(rule, ruleIndex)}
          </div>

          <div class="uk-tile-dotted-green">
            {this.renderLink(rule, ruleIndex)}
          </div>
        </div>
      )
  }

  render(){
        if(this.props.rules != undefined){
            let ruleList = []
            let index = 0
            for(var rule of this.props.rules){
              ruleList.push(this.renderRuleRow(rule, index++))
            }
            let map = React.Children.toArray(ruleList)
            return(
              <div>
                <div>{map}</div>
                <span class="uk-icon" uk-icon="plus-circle"
                  programCode = {this.props.keyRow}  
                  onClick={(e) => this.props.handleAdd(e)} ></span>
              </div>
            )
      }
      else{
        return(<div>
          <span class="uk-icon" uk-icon="plus-circle"
                  programCode = {this.props.keyRow}  
                  onClick={(e) => this.props.handleAdd(e)} ></span>
        </div>)
      }
  }
}

class WeekBadgeComponent extends React.Component{
 constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }


  handleInputChange(event){
    const target = event.target;
    let id = parseInt(target.id);
    //switch
    let newdays =  this.props.days.slice();//make copy

    //newdays[id] = (Math.abs(parseInt(this.props.days[id])) == 1 ? "0" : "1"); //switch
    newdays = newdays.replaceAt(id, (Math.abs(parseInt(this.props.days[id])) == 1 ? "0" : "1"));
    //update

    let valueCopy =  this.props.dataParent.props.value;
    valueCopy.days = newdays;
    this.props.dataParent.setState( {value : valueCopy});

  }

  render() {
     let ret = ['niedz', 'pon', 'wt', 'sr', 'czw', 'pia', 'sob'];
     //let val = '1111111';

       let val = this.props.days;
       let viewMode = (this.props.mode == 'view');

        let vals = [];
        for(let i = 0 ; i <  val.length; i++){
          if(viewMode && val.charAt(i) == '0')
           continue;

          let style = 'uk-badge-enabled ';

           if( val.charAt(i) == '0'){
               style = ' uk-badge-disabled';
           }

           vals.push(<span class={style} id = {i} onClick={this.handleInputChange} >{ret[i]}</span>);

        }
        //check is weekend
        if(val.charAt(0) == '1' && val.charAt(6) == '1' && vals.length == 2){
          vals = [<span class='uk-badge  uk-margin-small-bottom uk-margin-small-right'>weekend</span>];
        }

        if(viewMode){
              //dni robocze
              let workweek = true;
              for(let i = 1 ; i <  6; i++){
                 if(val.charAt(i) == '0'){
                   workweek = false;
                   break;
                 }
              }
              if(workweek){
                vals = [<span class='uk-badge uk-margin-small-bottom uk-margin-small-right'>dni robocze</span>];
              }

              //caly tydzieñ
              let fullweek = true;
              for(let i = 0 ; i <  val.length; i++){
                 if(val.charAt(i) == '0'){
                   fullweek = false;
                   break;
                 }
              }
              if(fullweek){
                vals = [<span class='uk-badge uk-margin-small-bottom uk-margin-small-right'>pełny tydzień</span>];
              }
        }
        let map = React.Children.toArray(vals)
        return (
             <a>{map}</a>
         );

  }
}

class SchedulerRowComponent extends React.Component{

 constructor(props) {
    super(props);
    this.state = {
      value: null,
      index : null,
      clientMqtt : undefined
    };
  }

 
  handleClick() {
    console.log('Click happened ' + this.props.value.mqtt_topic);
    this.props.clientMqtt.send(this.props.value.mqtt_topic, "command=switch");
  }

  render() {

    let style = "uk-tile uk-tile-small uk-margin-top uk-margin-right ";
     style += this.props.editMode ? "uk-tile-dotted" : ""

     if(this.props.index % 2 == 0)
       style += " uk-tile-default"
     else if(this.props.index % 3 == 0)
       style += " uk-tile-secondary"
     else
       style += " uk-tile-muted";

    if(this.props.value.mqtt_topic == undefined){
      return (<div class={style}>
                <p class="uk-h4">{this.props.value.code}</p>
              </div>);
    }
    //choose icon
    let checked = false
    if(this.props.value.armed != undefined ){
      if(this.props.value.armed == 1)
       checked = true;
    }

    return(
       <div class={style}>
         <div>
           <WeekBadgeComponent dataParent = {this} days = {this.props.value.days} mode='view'  />
           <div class='uk-badge'>{this.props.value.time}</div>
         </div>
         <p class="uk-h5" >{this.props.value.code}</p>

         <div class="uk-column-1-4">
           <p class="uk-text-small">{checked? "Uzbrojony" : "Wyłączony"}</p>
           <label class=" uk-margin-medium-left uk-switch uk-light" for={this.props.value.code+"_switch"}>
               <input checked={checked}   type="checkbox" id={this.props.value.code+"_switch"} onChange={() => this.handleClick()} />
               <div class="uk-switch-slider uk-switch-on-off round"></div>
           </label>
         </div>


       </div>
    );
  }
}

class DeviceRowComponent extends React.Component{

 constructor(props) {
    super(props);
    this.state = {
      value: null,
      index: null,
      clientMqtt : undefined
    };
  }
  handleClick() {
    console.log('Click happened ' + this.props.value.mqtt_topic);
    this.props.clientMqtt.send(this.props.value.mqtt_topic, "command=switch");
  }

  render() {
    let style = "uk-tile uk-tile-small uk-margin-top uk-margin-right "
   style += this.props.editMode ? "uk-tile-dotted" : "";

    if((this.props.index) % 2 == 0)
      style += " uk-tile-default"
    else if((this.props.index) % 3 == 0)
      style += " uk-tile-secondary"
    else
      style += " uk-tile-muted";


    if(this.props.value.mqtt_topic == undefined){
      return (<div class = {style}>
                <p class="uk-h4">{this.props.value.code}</p>
              </div>);
    }

    //temperature
    if(this.props.value.type == "Thermometer"){
      let temperature = (this.props.value.temperature != undefined  ? this.props.value.temperature : "");

      return(
         <div class={style}>
           <label class="uk-text-large uk-position-top" uk-icon={isEmpty(this.props.value.port) ? "git-branch" : ""} >{this.props.value.code} </label>
           <div class="uk-column-1-3">

             <div >
             <svg enable-background='new 0 0 19.438 54.003'
               px id='Layer_1'
               viewBox='0 0 19.438 54.003'
               width="19.438 px"
               x="0px"
               y="0px" >
               <g>
                 <path d='M11.976,8.82v2h4.084V6.063C16.06,2.715,13.345,0,9.996,0H9.313C5.965,0,3.252,2.715,3.252,6.063v30.982C1.261,38.825,0,41.403,0,44.286c0,5.367,4.351,9718,9.719,9.718c5.368,0,9.719-4.351,9.719-9.718c0-2.943-1.312-5.574-3.378-7.355V18.436h-3.914v-2h3.914v-2.808h-4.084v-2h4.084V8.82H11.976z M15.302,44.833c0,3.083-2.5,5.583-5.583,5.583s-5.583-2.5-5.583-5.583c0-2.279,1.368-4.236,3.326-5.104V24.257C7.462,23.01,8.472,22,9.719,22s2.257,1.01,2.257,2.257V39.73C13.934,40.597,15.302,42.554,15.302,44.833z'fill="#F29C21"
               />
               </g>
               </svg>
               <div>
                 <div class='side-by-side reading'>{temperature}<span class='superscript'>&deg;C</span></div>

               </div>
             </div>
           </div>
         </div>
      );
    }
    else {
      let checked = (this.props.value.status != undefined && this.props.value.status == "OnValue" ? true: false);

      return(
         <div class={style}>

           <label class="uk-text-large uk-position-top" uk-icon={isEmpty(this.props.value.port) ? "git-branch" : ""}  >{this.props.value.code}</label>
           <div class="uk-column-1-4 uk-margin-top">
             <p class="uk-text-small">{checked ? "Włączony" : "Wyłączony"}</p>
             <label class="uk-switch uk-light  uk-margin-medium-left" for={this.props.value.code+"_switch"}>
                 <input checked={checked}   type="checkbox" id={this.props.value.code+"_switch"} onChange={() => this.handleClick()} />
                 <div class="uk-switch-slider uk-switch-on-off round"></div>
             </label>
           </div>

         </div>
      );
    }

  }
}

class AppComponent extends React.Component{

   constructor(props) {
       super(props);

        this.state = {
           items : []
           ,scheduler : []
           ,settings : []
           ,isLoadingDevice : undefined
           ,isLoadingScheduler : undefined
           ,isLoadingSettings : undefined
           ,isSavingInProgress: false
           ,isRestartInProgress: false
           ,clientMqtt  : undefined
           ,editMode : false
           
       };
   }


   connectToMqttServer() {
     return new Promise((resolve, reject) => {

       let client = new Paho.MQTT.Client(this.state.settings.mqtt_server, Number(this.state.settings.mqtt_port_ws), generateUUID());        

       // connect the client
       client.connect({onSuccess:onConnect});
       
       // called when the client connects
       function onConnect() {
         // Once a connection has been made, make a subscription and send a message.
         resolve(client)
         console.log("mqtt onConnect success");
       }
     });
   }

   readSettings(){
    return new Promise((resolve, reject) =>  {
        this.setState({ isLoadingSettings: true });
        fetch('/getSettings')
        .then((response) => response.json())
        .then((responseJson) => {
              
              resolve(responseJson);
        })
        .catch((error) => {
          reject(error)
          console.log(error);
        });
    });
  }

   readSchedulers(){
       new Promise((resolve, reject) => {
           this.setState({  isLoadingScheduler: true });
             fetch('/getScheduler')
           .then((response) => response.json())
           .then((responseJson) => {
                 var orderedArray = _.orderBy(responseJson, ['sortId'], ['asc']);
                 this.setState({scheduler : orderedArray});
                 this.setState({ isLoadingScheduler: false });
                 resolve();
           })
           .catch((error) => {
             console.log(error);
           })
           .catch((error) => {
             reject(error)
             console.log(error);
           });
       });
   }

   readDevices(){
       new Promise((resolve, reject) => {
         this.setState({  isLoadingDevice: true });
             fetch('/getDevice')
             .then((response) => response.json())
             .then((responseJson) => {
                   var orderedArray = _.orderBy(responseJson, ['sortId'], ['asc']);
                   this.setState({items : orderedArray});
                   this.setState({ isLoadingDevice: false });
                   resolve();
             })
             .catch((error) => {
               reject(error)
               console.log(error);
             });
       });
   }

    //called when the client loses its connection
     onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("mqtt onConnectionLost:"+responseObject.errorMessage);
       
        this.loadData()
      }
    }

    async reloadData(){
      if(!this.state.editMode)
        this.loadData()
    }

   async loadData(){

       try{
          console.log("Load data begin ....")
          this.setState({ isLoadingDevice: true });
          this.setState({ isLoadingSettings: true });
          this.setState({ isLoadingScheduler: true });

          await this.readSchedulers()
          await this.readDevices();

          let json = await this.readSettings();
          
          this.setState({settings : json});
          this.setState({ isLoadingSettings: false });

          let mqttCLient = await this.connectToMqttServer();
          if (mqttCLient != undefined){

              if(this.state.clientMqtt != undefined)
                delete this.state.clientMqtt

              this.state.clientMqtt = mqttCLient
              //subscribe devices
              for(var item of this.state.items){
                  if(item.mqtt_topic != undefined){
                    mqttCLient.subscribe(item.mqtt_topic);
                    console.log("mqtt subscribe topic " + item.mqtt_topic);
                  }
              };

              //subscribe schedulers
              for(var item of this.state.scheduler){
                  if(item.mqtt_topic != undefined){
                    mqttCLient.subscribe(item.mqtt_topic);
                    console.log("mqtt subscribe topic " + item.mqtt_topic);
                  }
              };


              //TODO important
              mqttCLient.onMessageArrived = this.onMessageArrived.bind(this);
              mqttCLient.onConnectionLost  = this.onConnectionLost.bind(this);

              
          }
          else
            throw "Bład połaczenia mqtt"

          this.setState( { editMode : false});
          
          console.log("Load data end")
       }
       catch(error){
         UIkit.notification("Bład konfiguracji: " + error , {status:'primary'})
       }
       finally{
          this.setState({ isLoadingDevice: false });
          this.setState({ isLoadingSettings: false });
          this.setState({ isLoadingScheduler: false });
          console.log("Load data end")
       }
     }


     onMessageArrived(message) {

       let topic = message.destinationName
       let payload = message.payloadString
       console.log([topic, payload].join(": "));
       //devices
       for(var item of this.state.items){ 
           if(item.mqtt_topic != undefined && item.mqtt_topic == topic){

             let index = payload.indexOf("status=");
             if(index > -1){
               item.status =  payload.split("=")[1];
             }
             index = payload.indexOf("value=");
             if(index > -1){
               let arr =  payload.split("=");
               let parArr = arr[1].split("|")
               if(parArr.length  == 1)
                 item.temperature = parArr[0];
               else if(parArr.length == 3){
                 item.temperature =parArr[0];
                 item.pressure = parArr[1];
                 item.humidity = parArr[2];
               }
             }

             //item.mqtt_payload = payload;
             let newItems = [... this.state.items];
             this.setState( { items : newItems});
           }
       };

       //scheduler
       for(var item of this.state.scheduler){
           if(item.mqtt_topic != undefined && item.mqtt_topic == topic){

             let index = payload.indexOf("status=");
             if(index > -1){
               item.armed =  (payload.split("=")[1] == "OffValue" ? 0 : 1);
             }

             let newItems = [... this.state.scheduler];
             this.setState( { scheduler : newItems});
           }
       };
     };

   importFromFile(){
     let fileName = document.getElementById("importSettingsId");

     const file = fileName.files.item(0);
     const reader = new FileReader();
     reader.readAsText(file);
     reader.onload = () => {
       let importedJson =  JSON.parse(reader.result);
       
       //check device is the same
       let name = this.state.settings.name;


       if(name != undefined && name == importedJson.settings.name){
         
         this.setState({settings   : importedJson.settings});
         this.setState({scheduler  : importedJson.scheduler});
         this.setState({items      : importedJson.device});

         UIkit.notification("Import ustawień, urządzeń, programów", {status:'primary'})

       }else{ //Import external devices
         let items2Mod = [... this.state.items]; 
         //update sortId
         let maxSortId = _.maxBy(items2Mod , function(o){ return o.sortId ;}).sortId;
         
         _.each(importedJson.device, function(elem) {
           let topic = elem.mqtt_topic;
           let index = _.findIndex(items2Mod, function(o) { return o.mqtt_topic == topic; });
           if(index == -1){
             elem.sortId = ++maxSortId;  //adjust sort
             elem.port=undefined;        //clear port
             items2Mod.push(elem);
             console.log("add uniq item: " + elem.mqtt_topic );
           }
         });

         this.setState({items: items2Mod});

         UIkit.notification("Niezgodność urządzeń - import urządzeń zewnętrznych", {status:'primary'})
       }
     };
   
   }
   exportToFile(){
     //build full backup
     var json = {};
     json = {    "settings"    : this.state.settings
                 , "device"    : this.state.items
                 , "scheduler" : this.state.scheduler}

     saveJSON(json, this.state.settings.name + ".backup");
   }

   saveDataOnServer(){
     var json2Save = JSON.stringify(this.state.settings)
     this.setState({ isSavingInProgress: true });

     var promiseFun1 = new Promise((resolve, reject) => {

       fetch('/saveSettings', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(this.state.settings)
       })
       .then(response => {
         if (response.status === 200) {
             resolve();
         }
         else {
           UIkit.notification("Bład zapisu ustawień", {status:'warning'})
           reject();
         }
       });

     });

     var promiseFun2 = new Promise((resolve, reject) => {

       //add sortId element on this.state.items list

       var programList = Array.prototype.slice.call(document.getElementById("deviceList").children);
       var ord = 0;
       for(var it of programList){
         var found = _.find(this.state.items, { 'code' : it.getAttribute("code")})
         if( found != undefined)
           found.sortId = ord++;
       }

       fetch('/saveDevices', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(this.state.items)

       }
       ).then(response => {
         if (response.status === 200) {
             resolve();
         }
         else {
           UIkit.notification("Bład zapisu urzadzeń", {status:'warning'})
           reject();
         }
       });

     });


     var promiseFun3 = new Promise((resolve, reject) => {
       //add sortId element on this.state.scheduler list

       var programList = Array.prototype.slice.call(document.getElementById("programList").children);
       var ord = 0;
       for(var it of programList){
         var found = _.find(this.state.scheduler, { 'code' : it.getAttribute("code")})
         if( found != undefined)
           found.sortId = ord++;
       }

       fetch('/saveSchedulers', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(this.state.scheduler),
         }).then(response => {
           if (response.status === 200) {
               resolve();
           }
           else {
             UIkit.notification("Bład zapisu programów", {status:'warning'})
             reject();
           }
         });
     });

      
       Promise.all([promiseFun1,promiseFun2,promiseFun3]).then( result=>{
            this.setState({ isSavingInProgress: false });

            this.setState({ isRestartInProgress: true });
             console.log("all promises done during save - restart device now....");
             fetch('/restartDevice', {
               method: 'POST',
               headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
               },
               body: "",
               }).then(response => {
                 if (response.status === 200) {
                     //reset device success
                     console.log("device restarted");
                   
                     let delayTime = 5000;
                     this.setState({ isRestartInProgress: false });
                     UIkit.notification("Maszyna została zrestartowana", {status:'success',  timeout: delayTime})
                     this.setState( { editMode : false});
                    // window.location.reload(false);
                 }
                 else{
                   this.setState({ isRestartInProgress: false });
                   UIkit.notification("Bład restartu", {status:'warning'})
                 }
               });
       }).catch(function(err){
               UIkit.notification("Bład restartu", {status:'danger'})
              console.log(err);
           })
        

   }

  componentDidMount() {
     this.loadData()
     setInterval(() => this.reloadData(), 1000*60*10)//every 10 min 
  }

  componentWillUnmount() {
   }

  createNewDevice(){
     let randomCode = Math.random().toString(36).substring(7);
     let mqtt_topic = this.state.settings.name + "/device/" +randomCode;

     let newDevice = { port : "0", code : randomCode , mqtt_topic : mqtt_topic};

     let devices = this.state.items;
     devices.push(newDevice);

     this.setState({
       items: devices
     });
  }

  createNewProgram(){
    //generate random code
    let randomCode = Math.random().toString(36).substring(7);
    let mqtt_topic =  this.state.settings.name + "/program/" +randomCode;

     let newItem = { code : randomCode , time: '00:00', mqtt_topic : mqtt_topic, armed : 0, days :"1111111", rule : [], action: [{}]};

     let program = this.state.scheduler;
     program.push(newItem);

     this.setState({
       scheduler: program
     });
  }

  renderDeviceRow(index, device){
     let editDiv = (
         <div>
             <DeviceForm device = {device}
                 removeItem    = { () => this.handleDeviceRemove(event)   }
                 handleChange  = { () => this.handleDeviceChange(event) }
             />
         </div>
     );

      return (
           <li code={device.code}  class="uk-sortable-handle">
             <DeviceRowComponent 
                 index = {index} 
                 clientMqtt = {this.state.clientMqtt} 
                 value={device} 
                 editMode = {this.state.editMode}
                 domoticzIdx = {this.state.domoticzIdx}
                 />

             {this.state.editMode ?   editDiv : ''}
           </li>
      );
  }

  renderSchedulerRow(index, item){
      let editDiv = (
        <div >
          <ProgramForm  value = {item}
                        devices = {this.state.items}
                        handleRemove      = { () => this.handleRemoveProgram(event)   }
                        handleChange      = { () => this.handleChangeProgram(event)   }
                        handleRemoveRule  = { () => this.handleRemoveRule(event)   }
                        handleAddRule     = { () => this.handleAddRule(event)   }
          />
        </div>
      );
      return (
           <li code={item.code}  class="uk-sortable-handle">
             <SchedulerRowComponent index= {index} 
                                     clientMqtt = {this.state.clientMqtt} 
                                     value={item}
                                     editMode = {this.state.editMode}
                                     />
             {this.state.editMode ? editDiv : ''}
           </li>
       )
  }

  renderSchedulerRows(items){
    let html
    let arr = [];
    let index = 0;
    for(var i of items){
       arr.push(this.renderSchedulerRow(index++,i));
    }
    let map = React.Children.toArray(arr)
    let addNewDiv = (
      <div>
         <div class="uk-tile uk-tile-small uk-margin-top uk-margin-right  uk-tile-default">
           <div class="uk-column-1-4">
                 <p class="uk-h4">Dodaj nowy</p>
                 <span class="uk-icon" uk-icon="plus-circle"  onClick={(e) => this.createNewProgram(e)} ></span>
           </div>

         </div>
      </div>
    );
  
    return (
         <ul id= "programList" 
             class="uk-child-width-1-4@s uk-child-width-1-4@l uk-text-center uk-grid-match  uk-margin-top uk-margin-medium-bottom uk-grid" 
             uk-sortable={this.state.editMode ? "handle: .uk-sortable-handle" : false}
             >
           {map}
           {this.state.editMode ? addNewDiv : ''}
         </ul>
     )
  }

  renderDeviceRows(items){
    let html
    let arr = [];
    let index = 0;
    for(var device of items){
       arr.push(this.renderDeviceRow(index++, device));
    }

    //new el

    let map = React.Children.toArray(arr)

    let addNewDiv = (
       <div>
         <div class="uk-tile uk-tile-small uk-margin-top uk-margin-right  uk-tile-default">
           <div class="uk-column-1-4">
                 <p class="uk-h4">Dodaj nowy</p>
                 <span class="uk-icon" uk-icon="plus-circle"  onClick={(e) => this.createNewDevice(e)} ></span>
           </div>

         </div>
       </div> );

    return (
         <ul ul id= "deviceList"
             class="uk-child-width-1-4@s uk-child-width-1-4@l uk-text-center uk-grid-match  uk-margin-top uk-margin-medium-bottom uk-grid"  
             uk-sortable={this.state.editMode ? "handle: .uk-sortable-handle" : false}
         >
            {map}
            {this.state.editMode ? addNewDiv : ''}
       </ul>
     );
  }

   render(){

         if(this.state.isLoadingDevice || this.state.isLoadingDevice == undefined )
             return <p>Ładuję urządzenia...</p>;
         if(this.state.isLoadingSettings || this.state.isLoadingSettings == undefined)
           return <p>Ładuję ustawienia...</p>;
         if(this.state.isLoadingScheduler || this.state.isLoadingScheduler == undefined)
           return <p>Ładuję programy...</p>;

           if(this.state.isSavingInProgress)
           return <p>Zapisuję dane...</p>;

           if(this.state.isRestartInProgress)
           return <p>Restart urządzenia...</p>;

         let deviceId = this.state.settings.name;
         ReactDOM.render(deviceId,
            document.getElementsByTagName("title")[0]
         );

         return(
             <div>
               <div>
                 

                  <span class="uk-label">Cześć kontroler: {deviceId}</span>

                  <SettingsForm  items = {this.state.settings} eventChangeItem={() => this.handleSettingsChange(event)} editMode = {this.state.editMode}/>

                   <div class="uk-container uk-container-small uk-position-relative">

                       <div class="uk-flex-center uk-margin-top ">
                          <span class="uk-label">Podpięte urządzenia</span>
                               {this.renderDeviceRows(this.state.items)}
                       </div>

                       <div class="uk-flex-center uk-margin-top">
                          <span class="uk-label">Programy</span>
                            {this.renderSchedulerRows(this.state.scheduler)}
                       </div>
                   </div>

                   <div class= "uk-align-right uk-margin-right uk-margin-small-top">
                   { this.state.editMode ?
                         <div class="uk-panel uk-panel-box uk-panel-box-primary">
                           <div class="uk-align-right uk-margin-right uk-margin-small-top">
                             <button class="uk-button uk-button-danger" onClick={(e) => this.saveDataOnServer(e)}>
                                 Zapisz
                             </button>
                           </div>
                           <div class="uk-align-right uk-margin-right uk-margin-small-top">
                             <button class="uk-button uk-button-secondary" onClick={(e) => this.exportToFile(e)}>
                               Eksportuj ustawienia
                             </button>
                           </div>
                           <div class="uk-align-right uk-margin-right uk-margin-small-top">
                             <button class="uk-button uk-button-default" onClick={(e) => this.importFromFile(e)}>
                             
                               Importuj ustawienia
                             </button>
                             <input type="file" id="importSettingsId"></input>
                           </div>
                         </div>
                         :
                         <div>
                           <div class="uk-text-small uk-text-emphasis uk-margin-small-bottom">{this.state.editMode ? "Tryb edycji" : "Tryb Pracy"}</div>
                           <label class="uk-switch uk-light" for={"editModeId"}>
                               <input checked={this.state.editMode}   type="checkbox" id={"editModeId"} onChange={() => this.handleEditModeClick()} />
                               <div class="uk-switch-slider uk-switch-on-off round"></div>
                           </label>
                         </div>
                     }
                 </div>
                 
                   { this.state.editMode ?
                     <div>
                       <div>
                          <form method="post" enctype="multipart/form-data"  action="/upload">
                            <input type="file" name="Choose file"  accept=".json,.gz,.html,.ico,.js,.css"/>
                            <input class="uk-button uk-button-default" type="submit" value="załaduj" name="submit"/>
                          </form>
                      </div>
                    </div>
                   : ''}
               </div>
               </div>
         );
     }


     handleEditModeClick(){
       this.setState( { editMode : !this.state.editMode});
     }

     //settings - events handlers
     handleSettingsChange(event){
       const target = event.target;
       const name = target.name;

       let newSettings = this.state.settings;
       newSettings[name] = target.value;

       if(name == 'name'){
         //update mqtts
         //programs
         let array = [... this.state.scheduler]; //make copy
         for(var item of array){
             let splitted = item.mqtt_topic.split("/");
             splitted = _.drop(splitted); //remove first element
             item.mqtt_topic = target.value;
             for(var i of splitted){
               item.mqtt_topic += "/"+ i;
             }
           }

           this.setState({
             scheduler: array
           });

         //devices - for non port types
         array = [... this.state.items]; //make copy
         for(var item of array){
             let splitted = item.mqtt_topic.split("/");
             if(item.port && item.port.length > 0){
               splitted  = _.drop(splitted); //remove first element
               item.mqtt_topic = target.value;
               for(var i of splitted){
                 item.mqtt_topic += "/"+ i;
               }
             }
           }
           this.setState({
             items: array
           });
       }
       this.setState({
         settings: newSettings
       });
     }

     //programs - event handlers
     handleRemoveRule(event){
      const target = event.target
      const programCode     = target.getAttribute("programCode")
      const ruleIndex       = parseInt(target.getAttribute("ruleIndex"))

      let program =  this.state.scheduler.filter(item => item.code == programCode)[0]
      let rules =  program.rule
      if(rules.length == 1){
        program.rule =  []
      }
      else{
        rules.splice(ruleIndex,1)//remove rule at index
        program.rule = rules
      }
      this.setState({scheduler: this.state.scheduler})
     }

     handleAddRule(event){
      const target = event.target;
      const programCode     = target.getAttribute("programCode"); 
      let program =  this.state.scheduler.filter(item => item.code == programCode)[0];
      let rules = program.rule;

      //if has previous then add link operator to last
      if(rules != undefined){
        let len  = rules.length
        if(len > 0 ){
          let prevRule = rules[len -1]
          prevRule.linkOperator = "AND" //default operator  
        }
        rules.push({})
      }
      else{
        program.rule = [{}]
      }
      
      this.setState({scheduler: this.state.scheduler})
     }

     handleRemoveProgram(event){
       const target = event.target;
       const code = target.getAttribute("code");

       let nx =  this.state.scheduler.filter(item => item.code !== code);//filtruj przez wyrugowanie
       this.setState({ scheduler: nx});
     }

     handleChangeProgram(event){
       const target = event.target;
       const key =  target.getAttribute("keyRow");
       const code = target.name;
       const tag = target.getAttribute("tag")
       const index = target.getAttribute("index");

       let array = [... this.state.scheduler]; //make copy

       let program =  array.filter(item => item.code == key)[0];//filtruj

       //maintanin rules
       const ruleItems = ['device', 'targetValue', 'delta', 'operator', 'linkOperator'];
       const actionItems = ['device', 'command'];

       if(ruleItems.includes(code) && tag == "rule"){
         if(program.rule == undefined){
             program.rule = [];
             let json = {};
             json[code] = target.value;
             program.rule.push(json);
           }
           else
             program.rule[index][code] = target.value;
       }
       else if(actionItems.includes(code) && tag == "action" ){
         if(program.action == undefined){
             program.action = [];
             let json = {};
             json[code] = target.value;
             program.action.push(json);
           }
           else
             program.action[0][code] = target.value;
       }
       else
         program[code] = target.value;

       //update mqtt sub always
       program.mqtt_topic =  this.state.settings.name + "/program/" +program.code;

       //update
       this.setState({
         scheduler: array
       });
     }

     //device events handlers
     handleDeviceChange(event){
       const target = event.target;
       const key =  target.getAttribute("keyRow");
       const code = target.name;

       let array = [... this.state.items]; //make copy

       let device =  array.filter(item => item.code == key)[0];//filtruj
       let oldValue = device[code];

       device[code] = target.value;

       //during updating code change mqtt topic only when is not assigned to another device already.
       if(code ==  "code"  && ( !device.mqtt_topic  || device.mqtt_topic.indexOf(this.state.settings.name + "/device/") != -1 ))  {
         device.mqtt_topic =  this.state.settings.name + "/device/" + device.code;
       }

       //update
       this.setState({
         items: array
       });


       //update programs   action[device:], rule[device:]

       //programs
       array = [... this.state.scheduler]; //make copy
       for(var item of array){
          if(item.action != undefined){
              for (var ia of item.action){
                if(ia.device == oldValue){
                  ia.device = target.value;
                }
              }
          }
          if(item.rule != undefined){
            for (var ia of item.rule){
              if(ia.device == oldValue){
                ia.device = target.value;
              }
            }
          }
       }

         this.setState({
           scheduler: array
         });

     }

     handleDeviceRemove(event){
       const target = event.target;
       const code = target.getAttribute("code");

       let nx =  this.state.items.filter(item => item.code !== code);//filtruj przez wyrugowanie
       this.setState({ items: nx});
     }
}

//Main element
ReactDOM.render(<AppComponent/>, document.getElementById('rootApp'));
