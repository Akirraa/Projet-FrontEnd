package com.example.tp1category.controllers;

import com.example.tp1category.entities.Supplier;
import com.example.tp1category.repositories.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("supplier")
@CrossOrigin("*")
public class SupplierController {
    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping("list")
    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    @GetMapping("get/{id}")
    public Supplier getById(@PathVariable Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    @PostMapping("add")
    public Supplier add(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @PutMapping("update/{id}")
    public void update(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        supplierRepository.save(supplier);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Long id) {
        supplierRepository.deleteById(id);
    }
}
