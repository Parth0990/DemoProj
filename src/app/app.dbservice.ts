import {Injectable} from '@angular/core';
<<<<<<< HEAD
//const mysql = (<any>window).require('mysql');
=======
import { retry } from 'rxjs';
const mysql = (<any>window).require('mysql');
>>>>>>> 0b304bbfe91918fcae8c83be983a46eb7b47c03e


export class DBServiceModel{
    IsErrorExists:boolean = false;
    ErrorMessgae:string='';
    IsQueryExecuted:boolean=false;
    QueryResultData:any;
}

@Injectable({providedIn:'root'})
export class DBService {
    connection: any;

    constructor() {

<<<<<<< HEAD
        // this.connection = mysql.createConnection({
        //     host: 'localhost',
        //     user: 'root',
        //     password: 'password',
        //     database: 'MyDB'
        // });
        // this.connection.connect((err:any) => {
        //    if (err) {
        //      console.log('error connecting', err);
        //    }
        //    else 
        //    {
        //     alert('sucess');            
        //    }
        // });
=======
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'MyDB'
        });
        this.connection.connect((err:any) => {
           if (err) {
             console.log('error connecting', err);
           }
           else 
           {
            alert('sucess');            
           }
        });
>>>>>>> 0b304bbfe91918fcae8c83be983a46eb7b47c03e
    }

    query(sql: string) {
        let _dataResult = new DBServiceModel();

        this.connection.query(sql, function(err:any, results:any, fields:any) {
            if(!!err){
                _dataResult.IsErrorExists = true;
                _dataResult.ErrorMessgae = err.message;
            }
            else if(!!results){
                _dataResult.IsQueryExecuted = true;
                _dataResult.QueryResultData = results;
            }
            else
            {
                console.log('some error occurred!');
            }
            return _dataResult;
        });

        return _dataResult;

    }
}