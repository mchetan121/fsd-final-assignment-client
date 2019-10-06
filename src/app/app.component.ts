import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestModel } from './app-pojo/RequestModel';
import { ResponseModel } from './app-pojo/ResponseModel';
import { MatTabChangeEvent } from '@angular/material';
// const USERS: Employee[] = [
//   {userId: '1', firstName: 'Hydrogen', lastName: 'Bomb', employeeId: '111'},
//   {userId: '2', firstName: 'Helium', lastName: 'Bomb', employeeId: '222'},
//   {userId: '3', firstName: 'Lithium', lastName: 'Bomb', employeeId: '333'}
// ];


// const MANAGERS : DropDown[] = [
//   {value: 'Abc', viewValue: 'Abc'},
//   {value: 'Def', viewValue: 'Def'},
//   {value: 'Xyz', viewValue: 'Xyz'}
// ];

// const PROJECTS: Project[] = [
//   {projectId: '1111', projectName: 'Xyz', noOfTask: '2', startDate: '12/01/2010', endDate: '12/01/2020', priority: '2', completed: 'Yes'},
//   {projectId: '2222', projectName: 'Abc', noOfTask: '1', startDate: '12/01/2010', endDate: '12/01/2020', priority: '1', completed: 'No'},
//   {projectId: '3333', projectName: 'Pqr', noOfTask: '4', startDate: '12/01/2010', endDate: '12/01/2020', priority: '3', completed: 'Yes'}
// ]
const mgr:Manager[]=[{managerId:'',managerName:'vaibhav'},{managerId:'',managerName:'Bhushan'},{managerId:'',managerName:'Prajakta'}];


interface Employee {
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  projectId:Project;
  taskId:Task;
}

interface Project {
  projectId: string;
  projectName: string;
  noOfTask: string;
  startDate: string;
  endDate: string;
  priority: string;
  isCompleted: Boolean;
  isDeleted:Boolean;
  managerId:{managerId:string,managerName:string};
}
interface ParentTask{
  parentTaskId:string;
  parentTaskName:string;
  projectId:Project;
}
interface Task {
  taskId:string;
	task:string;
	taskStartDate:string;
	taskEndDate:string;
	priority:string;
	projectId:Project;
  parentTaskId:ParentTask;
  status:string;
}

interface Manager{
  managerId:string;
  managerName:string;
}
interface DropDown {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'projectMGMT';
  selected : any;
  selectedparent : any;
  selecteduser:any;
  selectedManager:any;
  userForm: FormGroup;
  projectForm: FormGroup;
  taskForm:FormGroup;
  edittaskForm:FormGroup;
  checkboxModel = {
    value1 : false,  
  };
  public edittaskshow:Boolean=false;
  private REST_API_SERVER = "http://localhost:9000/";
  // private REST_API_SERVER = "http://192.168.218.104:9000/";
  userColumns: string[] = ['firstName', 'lastName', 'employeeId', 'edit', 'delete'];
  projectColumns: string[] = ['projectName', 'noOfTask', 'startDate', 'endDate', 'priority', 'completed', 'update', 'suspend'];
  taskColumns: string[] = ['Task', 'Parent', 'priority', 'Start','End', 'completed','Edit','Delete'];

  // below to be removed after service integration
  // userData: Employee[] = USERS;
  // managers: DropDown[] = MANAGERS;
  // projectData: Project[] = PROJECTS;
   userData: Employee[] ;
   managers: Manager[] ;
   projectData: Project[];
   parentTaskData:ParentTask[];
   taskData:Task[];
public userObj:Employee;
  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    // responseType: 'text' as 'json'
  }
respModal:ResponseModel;
reqModal:RequestModel;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      userId: [{value: '', disabled: ''}],
      firstName: [{value: '', disabled: ''}, Validators.required],
      lastName: [{value: '', disabled: ''}, Validators.required],
      employeeId: [{value: '', disabled: ''}, Validators.required],
      projectId: [{value: null, disabled: ''}],
      taskId: [{value: null, disabled: ''}],
    });

    this.projectForm = this.fb.group({
      projectId: [{value: '', disabled: ''}],
      projectName: [{value: '', disabled: ''}, Validators.required],
      // setDate: [{value: '', disabled: ''}],
      noOfTask:[{value:'',disabled:''}],
      startDate: [{value: '', disabled: ''}],
      endDate: [{value: '', disabled: ''}],
      priority: [{value: '1', disabled: ''}],
      isCompleted:[{value:false,disabled:''}],
      isDeleted:[{value:false,disabled:''}],
      managerId: [{value: null, disabled: ''}],
    });

    this.taskForm = this.fb.group({
      taskId: [{value: '', disabled: ''}],
      task: [{value: '', disabled: ''}, Validators.required],
      taskStartDate: [{value: '', disabled: ''}],
      taskEndDate: [{value: '', disabled: ''}],
      priority: [{value: '1', disabled: ''}],
      projectId: [{value: null, disabled: ''}],
      parentTaskId: [{value: null, disabled: ''}],
      status: [{value: 'New', disabled: ''}],
      userId:[{value: null, disabled: ''}],
    });
    this.edittaskForm=this.fb.group({
      taskId: [{value: '', disabled: ''}],
      task: [{value: '', disabled: ''}, Validators.required],
      taskStartDate: [{value: '', disabled: ''}],
      taskEndDate: [{value: '', disabled: ''}],
      priority: [{value: '1', disabled: ''}],
      projectId: [{value: null, disabled: ''}],
      parentTaskId: [{value: null, disabled: ''}],
      status: [{value: 'New', disabled: ''}],
      userId:[{value: null, disabled: ''}],
    });

    // this.addManager();
    this.getProjects();
    this.getManagers();
    this.getUsers();
  }
//  public addManager(): void {
//       this.reqModal=new RequestModel(null,null,null,null,null,null,null);
//       this.respModal=new ResponseModel(null,null,null,null,null,null,null);
//       this.reqModal.reqList=mgr;
//       this.http.post(this.REST_API_SERVER+'insertManager', this.reqModal).subscribe( (data: any) => {
        
//       });
    
//   }
  public addUser(): void {
    if (this.userForm.valid) {          
      console.log(this.userForm.value);
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.reqModal.reqObject=this.userForm.value;
      this.http.post(this.REST_API_SERVER+'insertUser', this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.userData = Array.from(this.respModal.respList);
        this.userForm.reset();
        alert(this.respModal.message);
      });
    }
  }
 
  public getUsers(): void {
    // if (this.userForm.valid) {
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      
      this.http.post(this.REST_API_SERVER+'getallUser',this.reqModal,this.options).subscribe( (data: any) => {
        this.respModal=data;
        this.userData = Array.from(this.respModal.respList);
        console.log("this.userData");
        console.log(this.userData);
        this.userForm.reset();

     });
  
  }
  public editUser(employee: Employee): void {
    this.userForm.patchValue(employee);
  }

  public deleteUser(employee: Employee): void {
    console.log("delete");
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.reqModal.reqObject=employee;
      this.http.post(this.REST_API_SERVER+'deleteUser', this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.userData = Array.from(this.respModal.respList);
        this.userForm.reset();
        alert(this.respModal.message);
      });
  }
   
   userlist:Employee[]=[];
  public addTask(): void {
    if (this.taskForm.valid) {          
      console.log(this.taskForm.value);
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
     if(this.checkboxModel.value1){
      this.reqModal.extraVariable="parentTask";
     }else{
      this.reqModal.extraVariable="";
     }
      
      var tempobj=this.taskForm.value;
      var t=JSON.parse(JSON.stringify(tempobj.userId));
      this.userlist.push(t);

      this.reqModal.reqList=this.userlist;
      var taskObj = {taskId:'',parentTaskId:{},projectId:{},task:'',priority:'',taskStartDate:'',taskEndDate:'',status:''};
      taskObj.parentTaskId=tempobj.parentTaskId;
      taskObj.projectId=tempobj.projectId;
      taskObj.task=tempobj.task;
      taskObj.priority=tempobj.priority;
      taskObj.taskStartDate=tempobj.taskStartDate;
      taskObj.taskEndDate=tempobj.taskEndDate;
      taskObj.status=tempobj.status;
      this.reqModal.reqObject=JSON.parse(JSON.stringify(taskObj));

      this.http.post(this.REST_API_SERVER+'insertTask', this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.taskData =Array.from(this.respModal.respList) ;
        this.taskForm.reset();
        alert(this.respModal.message);
      });
    }
  }
   
 public getUserObjectByTask(task:any):void{
  
  this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.reqModal.reqObject=task;
      this.http.post(this.REST_API_SERVER+'getUserbytid',this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.userObj =this.respModal.respObject;

  });
 }
  public getTask(): void {
    
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      
      this.http.post(this.REST_API_SERVER+'getallTask',this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.taskData = Array.from(this.respModal.respList);
        this.taskForm.reset();

    
  });

    }
  public updateTask(task: Task): void {
    this.edittaskshow=true;
    console.log(task);
        
    this.edittaskForm.patchValue(task);
    this.selected=task.projectId.projectId
    this.onProjectChange(task.projectId);
    this.selectedparent=task.parentTaskId.parentTaskId;
    this.getUserObjectByTask(task);
    // if(this.userObj!==undefined){
      this.selecteduser=this.userObj;
    //}
    
  }
public updateTaskInDb():void{
  
  if (this.edittaskForm.valid) {          
    console.log(this.edittaskForm.value);
    this.reqModal=new RequestModel(null,null,null,null,null,null,null);
    this.respModal=new ResponseModel(null,null,null,null,null,null,null);
    var tempobj=this.edittaskForm.value;
    
    var t=tempobj.userId;
    this.userlist.push(t);
    
    var taskObj = {taskId:'',parentTaskId:{},projectId:{},task:'',priority:'',taskStartDate:'',taskEndDate:'',status:''};
    taskObj.taskId=tempobj.taskId;
    taskObj.projectId=tempobj.projectId;
    taskObj.task=tempobj.task;
    taskObj.priority=tempobj.priority;
    taskObj.taskStartDate=tempobj.taskStartDate;
    taskObj.taskEndDate=tempobj.taskEndDate;
    taskObj.status=tempobj.status;
     
    this.parentTaskData.forEach(element => {
      if(element.parentTaskId===tempobj.parentTaskId){
        taskObj.parentTaskId=element;
      }
    });
    this.reqModal.reqList=this.userlist
    this.reqModal.reqObject=JSON.parse(JSON.stringify(taskObj));

    this.http.post(this.REST_API_SERVER+'updateTask', this.reqModal).subscribe( (data: any) => {
      this.respModal=data;
      this.edittaskshow=false;
      this.taskData = Array.from(this.respModal.respList);
      if(this.respModal.statusCode==0){
        this.taskForm.reset();
        this.edittaskshow=false;
        alert(this.respModal.message);
      }else{
        alert(this.respModal.message);
      }
      this.taskForm.reset();
    });
  }

}
  public EndTask(task: Task): void {
    console.log("delete task");
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.reqModal.reqObject=task;
      this.http.post(this.REST_API_SERVER+'deleteTask', this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.taskData = Array.from(this.respModal.respList);
        this.taskForm.reset();
        alert(this.respModal.message);
      });
  }

  public getManagers(): void {
    this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.http.get(this.REST_API_SERVER+'getallManager').subscribe( (data: any) => {
        this.respModal=data;
        this.managers =Array.from(this.respModal.respList);
        console.log("this.managers");
        console.log(this.managers);

    });
  }

  public getProjects(): void {
  
    this.reqModal=new RequestModel(null,null,null,null,null,null,null);
    this.respModal=new ResponseModel(null,null,null,null,null,null,null);
    
    this.http.post(this.REST_API_SERVER+'getallProject',this.reqModal,this.options).subscribe( (data: any) => {
      this.respModal=data;
      this.projectData = Array.from(this.respModal.respList);
      console.log("project get all");
      console.log(this.projectData);

  });
  }

  public addProject(): void {
    if (this.projectForm.valid) {          
      console.log("this.projectForm.value");
      console.log(this.projectForm.value)
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.reqModal.reqObject=this.projectForm.value;
      this.http.post(this.REST_API_SERVER+'insertProject', this.reqModal).subscribe( (data: any) => {
        this.respModal=data;
        this.projectData = this.respModal.respList;
        this.projectForm.reset();
        alert(this.respModal.message);
      });
    }
  }
  public suspendProject(project: Project): void {
    
    console.log("delete project");
      this.reqModal=new RequestModel(null,null,null,null,null,null,null);
      this.respModal=new ResponseModel(null,null,null,null,null,null,null);
      this.reqModal.reqObject=project;
      alert("Work in Progress");
      // this.http.post(this.REST_API_SERVER+'deleteUser', this.reqModal).subscribe( (data: any) => {
      //   this.respModal=data;
      //   this.projectData = this.respModal.respList;
      //   this.projectForm.reset();
      //   alert(this.respModal.message);
      // });
  }
  public updateProject(project: Project): void {
    this.projectForm.patchValue(project);
    
    
  }
// public getParentTask():void{
 
// }

public updateProjectInDB():void{
  if (this.projectForm.valid) {          
    console.log("this.projectForm.value");
    console.log(this.projectForm.value)
    this.reqModal=new RequestModel(null,null,null,null,null,null,null);
    this.respModal=new ResponseModel(null,null,null,null,null,null,null);
    this.reqModal.reqObject=this.projectForm.value;
    this.http.post(this.REST_API_SERVER+'insertProject', this.reqModal).subscribe( (data: any) => {
      this.respModal=data;
      this.projectData = this.respModal.respList;
      this.projectForm.reset();
      alert(this.respModal.message);
    });
  }
}
public onProjectChange(value:Project):void{
  this.parentTaskData=[];
  this.reqModal=new RequestModel(null,null,null,null,null,null,null);
  this.respModal=new ResponseModel(null,null,null,null,null,null,null);
  this.reqModal.reqObject=value;
  this.http.post(this.REST_API_SERVER+'getallparenttaskbypid',this.reqModal,this.options).subscribe( (data: any) => {
    this.respModal=data;
    this.parentTaskData = this.respModal.respList;
    console.log(" get all parent Task");
    console.log(this.parentTaskData);

});
}

  public enable_text()
  {  
    this.checkboxModel.value1=!this.checkboxModel.value1;
  }
  onLinkClick(event: MatTabChangeEvent) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
  if(event.index===0){
    //project
    this.getManagers();
    this.getProjects();

  }else if(event.index===1){
    this.getUsers();
    this.getProjects();
    
  }else if(event.index===2){
    this.getUsers();
  }else if(event.index===3){
    this.edittaskshow=false;
    this.getTask();
  }
  }
}
