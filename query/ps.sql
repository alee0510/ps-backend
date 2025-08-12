SELECT * FROM actor;

-- get actor and its film
SELECT concat(actor.first_name, ' ',actor.last_name) as fullname, count(*) as total_film FROM actor
JOIN film_actor ON actor.actor_id = film_actor.actor_id
JOIN film ON film_actor.film_id = film.film_id
GROUP BY actor.actor_id;


SELECT * FROM customer;

-- pagination
SELECT * FROM customer
LIMIT 10 OFFSET 20;

-- routers
-- get actor profile -> default limit 10 (pagination)
-- get film
-- get actor with film biograpy
-- implement searching on route get users

