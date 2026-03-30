package com.example.tp1category.controllers;


import com.example.tp1category.entities.Product;
import com.example.tp1category.repositories.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("product")
@CrossOrigin("*")
public class ProductController {
    public final ProductRepository productRepository;
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("List")
    public List<Product> afficher(){
        return productRepository.findAll();
    }

    @PostMapping("add")
    public Product ajouter(@RequestBody Product product){
        return productRepository.save(product);
    }

    @GetMapping("/get/{id}")
    public Product getById(@PathVariable Long id){
        return productRepository.findById(id).orElse(null);
    }

    @PutMapping("update/{id}")
    public void update(@PathVariable Long id, @RequestBody Product product){
        product.setId(id);
        productRepository.save(product);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Long id){
        productRepository.deleteById(id);
    }
}
