import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from '../../shared/product.service';
import {NzModalRef} from 'ng-zorro-antd';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {
  isSpinning = false; // 加载状态
  uploading = false;

  target_file: DataTransfer;
  file_valid = true;
  file_error = false;
  file_success = false;

  err_list = [];
  fail_count = 0;
  success_count = 0;

  @Input() type: string;

  constructor(
    private productService: ProductService,
    private modal: NzModalRef
  ) { }

  ngOnInit() {
  }

  // 获取文件名
  getFile(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.target_file = target;
    // console.log(target.files[0].name)
    console.log(target.files[0].type)
    if (target.files.length === 1) {
      this.file_valid = false;
    }
    if (target.files.length !== 1) {
      // this.msg.success('不能上传多个文件！');
      this.file_error = true;
      this.file_valid = true;
    }
  }

  // 转成Json
  fileToJson(target) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, {header: 1, blankrows: false});
      if (this.type === 'PRODUCT') {
        this.uploadProduct(data);
      }
      if (this.type === 'VSKU') {
        this.uploadVsku(data);
      }
      if (this.type === 'COMBO') {
        this.uploadCombo(data);
      }
      if (this.type === 'VCOMBO') {
        this.uploadVcombo(data);
      }
      if (this.type === 'SUPPLIER') {
        // console.log(JSON.stringify(data))
        this.uploadSupplier(data);
      }
    };

      reader.readAsBinaryString(target.files[0]);
      this.file_success = true;

  }

  /**
   * 批量导入产品
   * */
  uploadProduct(data): void {
    this.uploading = true;
    this.productService.bulkAddProduct(data).subscribe(
      val => {
        if (val.status === 201) {
          this.err_list = val.body.err_list;
          this.fail_count = val.body.fail_count;
          this.success_count = val.body.success_count;
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.uploading = false;
      },
      () => this.uploading = false
    );
  }

  /**
   * 批量导入虚拟sku
   * */
  uploadVsku(data): void {
    this.uploading = true;
    this.productService.bulkAddVsku(data).subscribe(
      val => {
        if (val.status === 201) {
          this.err_list = val.body.err_list;
          this.fail_count = val.body.fail_count;
          this.success_count = val.body.success_count;
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.uploading = false;
      },
      () => this.uploading = false
    );
  }

  /**
   * 批量导入组合
   * */
  uploadCombo(data): void {
    this.uploading = true;
    this.productService.bulkAddCombo(data).subscribe(
      val => {
        if (val.status === 201) {
          this.err_list = val.body.err_list;
          this.fail_count = val.body.fail_count;
          this.success_count = val.body.success_count;
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.uploading = false;
      },
      () => this.uploading = false
    );
  }

  /**
   * 批量导入虚拟组合
   * */
  uploadVcombo(data): void {
    this.uploading = true;
    this.productService.bulkAddVcombo(data).subscribe(
      val => {
        if (val.status === 201) {
          this.err_list = val.body.err_list;
          this.fail_count = val.body.fail_count;
          this.success_count = val.body.success_count;
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.uploading = false;
      },
      () => this.uploading = false
    );
  }

  /**
   * 批量导入供应商
   * */
  uploadSupplier(data): void {
    this.uploading = true;
    this.productService.bulkAddSupplier(data).subscribe(
      val => {
        if (val.status === 201) {
          this.err_list = val.body.err_list;
          this.fail_count = val.body.fail_count;
          this.success_count = val.body.success_count;
        } else {
          console.log(val);
        }
      },
      err => {
        console.log(err);
        this.uploading = false;
      },
      () => this.uploading = false
    );
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.success_count > 0 ? 'ok' : null});
  }

}
