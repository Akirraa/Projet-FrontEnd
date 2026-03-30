package com.example.tp1category.controllers;

import com.example.tp1category.entities.Category;
import com.example.tp1category.repositories.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("category")
@CrossOrigin("*")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("list")
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @GetMapping("/get/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @PostMapping("add")
    public Category add(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @PutMapping("update/{id}")
    public void update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        categoryRepository.save(category);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}
