import { compareAsc, isPast } from "date-fns";
import './index.css';

(function(){
    class Task{
        constructor(activity,desc,date,priority,status){
            this.activity = form.activity.value;
            this.desc = form.desc.value;
            this.date = form.date.value;
            this.priority = form.priority.value;
            this.status = 'ongoing';        
        }
    }

    let myTask = [];
    let myCompletedTask = [];

    const addbtn = document.querySelector('.add');
    const panelLayOut = document.querySelector('.panel');
    const close = document.querySelector('.close');
    const enter = document.querySelector('.enter');
    const taskContainer = document.querySelector('.taskContainer');

    addbtn.addEventListener('click', ()=>{
        showPanel();
    })

    const showPanel = () => {
        event.preventDefault();
        panelLayOut.style.display = 'block';
        taskContainer.style.display = 'none';
        close.addEventListener('click', ()=>{
            panelLayOut.style.display = 'none';
        
        })
        enter.addEventListener('click', ()=>{
            if (form.activity.value != "" && form.date.value != ''){
                panelLayOut.style.display = 'none';
                taskContainer.style.display = 'block';
                let newTask = new Task(activity,desc,date,priority,status);
                myTask.push(newTask); 
                updateLocalStorage();
                sort.value === 'date' ?  sortDate(myTask): sortPriority(myTask);
                form.reset();
            }
        })
    }

    function updateLocalStorage(){
        localStorage.setItem('myTask', JSON.stringify(myTask));
        localStorage.setItem('myCompletedTask', JSON.stringify(myCompletedTask));        
    }

    function renderList(taskDiv) {
        const tasks = document.querySelectorAll('.taskSec');
        tasks.forEach(task => taskContainer.removeChild(task));
        for (let i = 0; i < taskDiv.length; i++){
            createTask(taskDiv[i]);
        }
    }

    function createTask(task){
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskSec');
        taskDiv.setAttribute('id', myTask.indexOf(task));
        namingTask('Activity',task.activity);
        namingTask('Desc',task.desc);
        namingTask('Date', task.date);
        namingTask('Priority', task.priority);
        namingTask('Checkbox');
        taskContainer.appendChild(taskDiv); 
        changeTaskColor(taskDiv);
        function namingTask(Id,value){
            if (Id == 'Checkbox'){
                const div = document.createElement('input');
                div.type = 'checkbox';
                div.classList.add('checkbox');
                if(task.status == 'completed'){
                    div.checked = true;
                } else {
                    div.checked = false;
                }
                taskDiv.append(div);
            } else {
                const div = document.createElement('div');
                div.setAttribute('id', Id);
                div.textContent = value;
                div.classList.add('sec');
                taskDiv.append(div);
            }
        }
    }
    
    function changeTaskColor(task){
        let currentTaskDate = new Date(task.childNodes[2].textContent);
        let priority = task.childNodes[3].textContent;
        if (task.childNodes[4].checked){
            task.style.backgroundColor = 'lightgrey';
        } else if (isPast(currentTaskDate)){
            task.style.backgroundColor = 'grey';
        } else if (priority == 'urgent'){
            task.style.backgroundColor = 'red';
        } else if (priority == 'important'){
            task.style.backgroundColor = 'yellow';
        } else if (priority == 'goal'){
            task.style.backgroundColor = 'lightgreen';
        }
    }

    //module for sort ongoing and date
    function sortDate(taskDiv){
       let localCalendar = [];
       let localArr = taskDiv;
        for (let i = 0; i < taskDiv.length; i++){
            const currentDate = new Date(taskDiv[i].date);
            localCalendar.push(currentDate)
        }
        for (let index = localCalendar.length; index >= 0 ; index--) {
            let currentDate = localCalendar[index];
            let nextDate = localCalendar[index+1];
            let currentTask = localArr[index];
            let nextTask = localArr[index+1];
            let sortNumber = compareAsc(currentDate,nextDate);
            if (sortNumber === 1){
                localCalendar.splice(index,1,nextDate);
                localCalendar.splice(index+1,1,currentDate)
                localArr.splice(index,1,nextTask);
                localArr.splice(index+1,1,currentTask);
            }
        }
        renderList(localArr);
    }
    
    // cannot sort through all/ only partial when doing sort.eventlisterner
    function sortPriority(taskDiv){
        let urgentArr = [];
        let importantArr = [];
        let goalArr = [];
        for (let i = 0; i < taskDiv.length; i++) {
            if(taskDiv[i].priority === 'urgent'){
                urgentArr.push(taskDiv[i]);
            } else if (taskDiv[i].priority === 'important'){
                importantArr.push(taskDiv[i]);
            } else if (taskDiv[i].priority === 'goal'){
                goalArr.push(taskDiv[i]);
            }
        }
        let finalArr = urgentArr.concat(importantArr,goalArr);
        renderList(finalArr);
    }

    sort.addEventListener('click', (click)=>{
        if (click.target.text === 'Date') {
            progress.value === 'ongoing' ?  sortDate(myTask): sortDate(myCompletedTask); 
        } else if (click.target.text === 'Priority'){
            progress.value === 'completed' ?  sortPriority(myCompletedTask): sortPriority(myTask);
        }
        
    })

    progress.addEventListener('click', (click)=>{
        if (click.target.text == 'On Going'){
            sort.value === 'date' ?  sortDate(myTask): sortPriority(myTask); 
        } else if (click.target.text === 'Completed') {
            sort.value === 'priority' ?  sortPriority(myCompletedTask): sortDate(myCompletedTask); 
        }
    })

    window.addEventListener('click', (click)=>{
        const clickTarget = click.target;
        // Change Task To Completed When User Click
        if(clickTarget.parentNode.classList == 'taskSec' && clickTarget.checked == true){
            myTask[(clickTarget.parentNode.id)].status = 'completed';
            myCompletedTask.push(myTask[(clickTarget.parentNode.id)]);
            myTask.splice((clickTarget.parentNode.id),1)
            updateLocalStorage();
            renderList(myTask);
        }
    }) 

})()
