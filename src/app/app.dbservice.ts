import {Injectable} from '@angular/core';
import { retry } from 'rxjs';
const mysql = (<any>window).require('mysql');


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