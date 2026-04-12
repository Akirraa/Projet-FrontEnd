package com.example.tp1category.controllers;

import com.example.tp1category.entities.Order;
import com.example.tp1category.repositories.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("order")
@CrossOrigin("*")
public class OrderController {
    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("list")
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @GetMapping("get/{id}")
    public Order getById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @PostMapping("add")
    public Order add(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PutMapping("update/{id}")
    public void update(@PathVariable Long id, @RequestBody Order order) {
        order.setId(id);
        orderRepository.save(order);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
