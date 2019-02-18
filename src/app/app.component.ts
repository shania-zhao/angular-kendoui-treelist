import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var $: any;
declare var kendo: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.createTree();
  }

  createTree() {
    this._http.get('assets/tree.json')
      .subscribe((treeData: any) => {
        const treeList = treeData.data;
        console.log($('#tree'));
        const options = this.createTreeOptions(treeList);
        options['dataBound'] = (kendoEvent: any) => {
          const tree = kendoEvent.sender;
          tree.select($('#tree tr:eq(4)'));
        };
        $('#tree').kendoTreeList(options);
      }
    );
  }

  createTreeOptions(treeList: any) {
    return {
      dataSource: this.createTreeDataSource(treeList),
      selectable: 'row',
      columns: [{
        template: '#= text #'
      }],
      columnMenu: false
    };
  }

  createTreeDataSource(treeList: any) {
    return new kendo.data.TreeListDataSource({
      data: treeList.map(((item: any) => {
        item.expanded = true;
        return item;
      })),
      schema: {
        model: {
          id: 'id',
          parentId: 'parentId',
          fields: {
            id: {
              type: 'number'
            },
            parentId: {
              type: 'number',
              nullable: true
            }
          }
        }
      }
    });
  }
}
