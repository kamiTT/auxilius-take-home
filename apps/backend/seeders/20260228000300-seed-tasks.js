'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Set up project board',
        description: 'Create initial board columns and workflow',
        status: 'to do',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Define API contracts',
        description: 'Document payloads for tasks and users',
        status: 'in progress',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Implement authentication',
        description: 'Add middleware for token validation',
        status: 'to do',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Write integration tests',
        description: 'Cover CRUD and websocket notifications',
        status: 'in progress',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Prepare release notes',
        description: null,
        status: 'done',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tasks', {
      title: {
        [Sequelize.Op.in]: [
          'Set up project board',
          'Define API contracts',
          'Implement authentication',
          'Write integration tests',
          'Prepare release notes'
        ]
      }
    });
  }
};
