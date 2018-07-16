import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Product, ProductService} from '../../../shared/product.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {
  isSpinning = false; // 加载状态
  product: Product[]
  search = '';  // 搜索值
  pageSize = 20;  // 默认一页显示条数
  totalCount = 0;  // 供应商总数
  status = 'ON_SALE'

  constructor(
    private modal: NzModalRef,
    private productService: ProductService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // 向服务器获取产品列表数据
    this.isSpinning = true;
    const urlparams = new URLSearchParams();
    urlparams.append('page_size', this.pageSize.toString());
    urlparams.append('status', this.status);

    this.productService.getBaseProduct(urlparams.toString()).subscribe(
      val => {
        this.product = val.results;
        this.totalCount = val.count;
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.isSpinning = false;
      },
      () => this.isSpinning = false
    );
  }

  /**
   * 获取供应商列表数据（供调用）
   * */
  getProducts(params) {
    this.isSpinning = true;
    this.productService.getBaseProduct(params).subscribe(
      val => {
        this.product = val.results;
        this.totalCount = val.count;
      },
      err => {
        this.message.create('error', `请求异常 ${err.statusText}`);
        this.isSpinning = false;
      },
      () => this.isSpinning = false
    );
  }

  /**
   * 清除搜索
   * */
  cleanSearch() {
    this.search = '';
    this.listFilter();
  }


  /**
   * 页码改变回调
   * */
  pageIndexChange(page) {
    const urlparams = new URLSearchParams();
    urlparams.append('status', this.status);
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    urlparams.append('page', page);

    this.getProducts(urlparams);
  }

  /**
   * 每页显示条数改变回调
   * */
  pageSizeChange(pageSize) {

    const urlparams = new URLSearchParams();
    urlparams.append('status', this.status);
    urlparams.append('page_size', pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }

    this.getProducts(urlparams);
  }

  /**
   * 产品搜索
   * */
  listFilter() {
    const urlparams = new URLSearchParams();
    urlparams.append('status', this.status);
    urlparams.append('page_size', this.pageSize.toString());
    if (this.search) {
      urlparams.append('search', this.search);
    }
    this.getProducts(urlparams);
  }

  /**
   * 选中产品
   * */
  chooseProduct(p: Product) {
    this.modal.destroy(p);
  }

  // 确认提交
  destroyModal(): void {
    this.modal.destroy();
  }

}
