import { Component } from '@angular/core';
import * as Bucket from '@spica-devkit/bucket';
import { Product } from './interfaces/product.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'my-app';
  public productList: Product[] = [];
  editingFields: { [key: string]: boolean } = {}; // Track the editing state of each field

  isEditing(productId: string, field: string): boolean {
    return this.editingFields[`${productId}-${field}`];
  }

  toggleEditing(productId: string, field: string) {
    this.editingFields[`${productId}-${field}`] = !this.isEditing(productId, field);
  }
  constructor() {
    
  }

  async ngOnInit() {
    Bucket.initialize({apikey: "cklbx019ljr002fa", publicUrl: "https://master.spicaengine.com/api"});
    this.getProduct();
    
  }
  
  
  async getProduct(){
    try {
      
      this.productList = []; // Clear the productList array
      
      const dataget = await Bucket.data.getAll<Product>("64a67428bcd096002df2caa0");
      this.productList.push(...dataget);
      console.log(this.productList);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
  }
  
  async addProduct() {
    const newDocument = {
        title: (<HTMLInputElement>document.getElementById('title')).value,
        description: (<HTMLInputElement>document.getElementById('description')).value,
        id: (<HTMLInputElement>document.getElementById('id')).value,
        price: Number((<HTMLInputElement>document.getElementById('price')).value),
    };

    await Bucket.data.insert("64a67428bcd096002df2caa0", newDocument);
    
    this.getProduct();
  }


  async updateProduct(product: any) {
    try {
      const updatedData = {
        title: product.title,
        description: product.description,
        id: product.id,
        price: Number(product.price),
      };

      await Bucket.data.update("64a67428bcd096002df2caa0", product._id, updatedData);
      console.log('Data updated successfully.');
      // Optional: Exit edit mode for all fields after updating the product
      for (const field in this.editingFields) {
        if (this.editingFields.hasOwnProperty(field)) {
          this.editingFields[field] = false;
        }
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async deleteProduct(productId: string) {
    try {
      await Bucket.data.remove("64a67428bcd096002df2caa0", productId);
  
      // Update productList after successful deletion
      this.productList = this.productList.filter(product => product._id !== productId);
  
      console.log('Product deleted successfully.');
      await this.getProduct();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  
  
}


