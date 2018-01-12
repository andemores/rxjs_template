// RxJS
import * as  Rx from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import viewStream from 'material-ui/svg-icons/action/view-stream';


interface Event
{
    data : any

}



class Model
{
    subject : Rx.Subject<Event>;
    constructor(subject :  Rx.Subject<Event>)
    {
        this.subject = subject;


    }

    method1(arg : Event) 
    {
        console.log("MOdel got event " + arg.data);

        if (arg.data == "show")
        {
            
            this.subject.next ( { data : "isShown"} );

        }
        

    }

    sendEventFromModel(arg : any)
    {

        this.subject.next ( { data : arg} );

    }


}

class Widget1
{
    modelSubject : Rx.Subject<Event>;
    viewSubject : Rx.Subject<Event>;
    name : string
    constructor(name : string, modelSubject :  Rx.Subject<Event>, viewSubject :  Rx.Subject<Event>)
    {
        this.name = name;
        this.modelSubject = modelSubject;
        this.viewSubject = viewSubject;

        // Obeserve model
        let sub = this.modelSubject.subscribe (
            {
                next : (args : Event) => {
                    console.log("Widget " + this.name + " got " + args.data);
                }
            }

        )        
    }

    // Simulate events from widget
    simulateEvent(arg : string)
    {
        console.log("Widget " + this.name + " sendign event " + arg)    ;
        this.viewSubject.next ( { data : arg} );


    }
    
}


// Controller
export class app
{
    
    constructor()
    {
        

        let modelSubject = new Rx.Subject<Event>();
        let viewSubject = new Rx.Subject<Event>();

        let model = new Model ( modelSubject);
        
        // Observer widgets
        let viewSubjectSubscription =  viewSubject.subscribe ( {
            next : (arg : Event) => {
                console.log("Controller got event from widget");

                // Forward to model
                model.method1(arg);
                
            }
        });

        let widget1 = new Widget1 (  "widget1", modelSubject, viewSubject);

        let widget2 = new Widget1 (  "widget2", modelSubject, viewSubject);

        model.sendEventFromModel("A");
        widget1.simulateEvent("show");

        //let s = Rx.Subject();

    }

}


