export class CommonMethods{
    SetItemInLocalStorage(key: string, value: string){
        localStorage.setItem(key, value);
    }

    GetItemFromLocalStorage(key: string): string{
        let item: any;
        if(localStorage.getItem(key)){
            item = localStorage.getItem(key)?.toString();
        }

        return item;
    }

    RemoveItemFromLocalStorage(key: string){
        localStorage.removeItem(key);
    }
}