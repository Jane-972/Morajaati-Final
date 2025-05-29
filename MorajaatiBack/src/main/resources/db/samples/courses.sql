INSERT INTO courses (id, title, description, rating, upload_date, professor_id) VALUES
-- Computer Science courses (Professor Mohamed Alaoui)
    ('ab933345-c6cf-4a55-b30b-6303ed1d6f21', 'Introduction to Artificial Intelligence', 'Fundamentals of AI including machine learning, neural networks, and natural language processing.', 4.5, '2023-01-15 09:00:00', 'bcd8ff67-60b1-4ea6-819b-d27edacf1f91'),
    ('dd6bfcdc-1876-4dfe-83d6-932f000a34c6', 'Advanced Machine Learning', 'Deep dive into supervised and unsupervised learning algorithms with Python implementations.', 4.7, '2023-02-20 10:30:00', 'bcd8ff67-60b1-4ea6-819b-d27edacf1f91'),

-- Mathematics courses (Professor Fatima Benali)
    ('5916ee06-d29d-4c23-8bac-e45111654ed5', 'Abstract Algebra', 'Group theory, ring theory, and field theory with applications in cryptography.', 4.2, '2023-01-10 08:00:00', 'b87c84f0-7c71-4382-8ab3-6f424bcaa32e'),
    ('d71d3cb6-e12e-46a4-89c6-1f853060c1c6', 'Number Theory', 'Prime numbers, modular arithmetic, and Diophantine equations.', 4.3, '2023-03-05 11:00:00', 'b87c84f0-7c71-4382-8ab3-6f424bcaa32e'),

-- Physics courses (Professor Ahmed El Amrani)
    ('a0352ed9-888f-4c62-8ab5-8ade1738707d', 'Quantum Mechanics', 'Wave functions, Schrödinger equation, and quantum states.', 4.8, '2023-02-01 13:00:00', '5fe2877d-7404-40d1-8cb1-ceaa98d77721'),
    ('bd27ae94-fbf9-4569-bdbf-39689bfa4d0d', 'Particle Physics', 'Standard Model, quarks, leptons, and fundamental forces.', 4.6, '2023-04-10 14:30:00', '5fe2877d-7404-40d1-8cb1-ceaa98d77721'),

-- Chemistry courses (Professor Amina Chraibi)
    ('c18024f0-7c41-4149-a314-03c2ec705081', 'Organic Chemistry', 'Structure, properties, and reactions of organic compounds.', 4.4, '2023-01-22 10:00:00', '90a5b96c-1ec7-4991-aecc-4b2b3799b4f7'),
    ('b88b0d0b-3771-4184-8bf5-1fef6ff8c5ab', 'Nanotechnology in Medicine', 'Applications of nanomaterials in drug delivery and diagnostics.', 4.9, '2023-03-15 09:30:00', '90a5b96c-1ec7-4991-aecc-4b2b3799b4f7'),

-- Engineering courses (Professor Youssef Boukhari)
    ('3dcaff90-5084-46c8-a7dd-3e1b77802869', 'Structural Engineering', 'Analysis and design of earthquake-resistant structures.', 4.1, '2023-02-05 08:30:00', 'fdc9fc71-e833-4343-971b-6ba74166794c'),
    ('c0d778a5-c399-4ecc-b06b-9e39845c191c', 'Sustainable Construction', 'Green building materials and energy-efficient design.', 4.3, '2023-04-01 11:00:00', 'fdc9fc71-e833-4343-971b-6ba74166794c'),

-- Arabic Literature courses (Professor Khadija El Fassi)
    ('4ec92324-cd25-4301-b7af-e42067851d9d', 'Classical Andalusian Poetry', 'Study of Zajal and Muwashahat poetry forms.', 4.0, '2023-01-18 14:00:00', 'c5b5fedd-ad63-4e58-8183-894763a0f6f5'),
    ('9522b5d6-76ce-4598-982d-42f946aa3878', 'Modern Arabic Novel', 'Analysis of 20th century Arabic literary works.', 4.2, '2023-03-22 16:00:00', 'c5b5fedd-ad63-4e58-8183-894763a0f6f5'),

-- Economics courses (Professor Mehdi Zeroual)
    ('24e19e25-9849-48be-973c-9ebb33699381', 'Development Economics', 'Economic growth strategies for developing nations.', 4.6, '2023-02-10 10:00:00', 'fa78fa25-abbd-44a7-8296-3641d161f1c1'),
    ('62e806c8-5285-4d7e-a1fd-73cf0826a726', 'Maghreb Economic Systems', 'Comparative study of North African economies.', 4.5, '2023-04-05 13:30:00', 'fa78fa25-abbd-44a7-8296-3641d161f1c1'),

-- Medicine courses (Professor Nadia Bennani)
    ('5db81ca8-b6a3-4426-ba6f-130e22308984', 'Cardiovascular Medicine', 'Diagnosis and treatment of heart diseases.', 4.7, '2023-01-25 09:00:00', '470b53ab-af7c-4e0e-a803-2a6f3405e989'),
    ('1448cc6b-b41f-4c17-a8cb-890f6132277a', 'Preventive Cardiology', 'Strategies for preventing heart disease in MENA region.', 4.8, '2023-03-18 11:00:00', '470b53ab-af7c-4e0e-a803-2a6f3405e989'),

-- Islamic Studies courses (Professor Karim Cherkaoui)
    ('af545996-9f2c-4d9a-825a-90a3dfb4591e', 'Islamic Jurisprudence', 'Fiqh studies with focus on Maliki school of thought.', 4.3, '2023-02-15 08:00:00', '510d9dfa-813c-43e6-8a7c-08b40f02dbea'),
    ('25596ac0-f5cb-4ba5-ad8a-c688bc140866', 'Comparative Religion', 'Study of Abrahamic faiths with emphasis on interfaith dialogue.', 4.4, '2023-04-12 14:00:00', '510d9dfa-813c-43e6-8a7c-08b40f02dbea'),

-- Architecture courses (Professor Samira El Mansouri)
    ('8d06ad8b-577f-4a34-ae25-ee5a9603df21', 'Vernacular Architecture', 'Traditional Moroccan building techniques and designs.', 4.6, '2023-01-30 10:30:00', 'f441de73-1e94-4857-ad85-9815a8286f97'),
    ('d2e51a08-101f-472f-8229-1cc00985894f', 'Sustainable Urban Design', 'Eco-friendly approaches to city planning in arid climates.', 4.7, '2023-03-25 15:00:00', 'f441de73-1e94-4857-ad85-9815a8286f97');
