package com.example.tp1category.controllers;

import com.example.tp1category.entities.Cart;
import com.example.tp1category.repositories.CartRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("cart")
@CrossOrigin("*")
public class CartController {
    private final CartRepository cartRepository;

    public CartController(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @GetMapping("list")
    public List<Cart> getAll() {
        return cartRepository.findAll();
    }

    @GetMapping("get/{id}")
    public Cart getById(@PathVariable Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    @PostMapping("add")
    public Cart add(@RequestBody Cart cart) {
        return cartRepository.save(cart);
    }

    @PutMapping("update/{id}")
    public void update(@PathVariable Long id, @RequestBody Cart cart) {
        cart.setId(id);
        cartRepository.save(cart);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Long id) {
        cartRepository.deleteById(id);
    }
}
