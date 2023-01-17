import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateShiftsTable1673966299403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shifts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'work_day',
            type: 'timestamp',
          },
          {
            name: 'shift_slot',
            type: 'varchar',
          },
          {
            name: 'worker_id',
            type: 'uuid',
          },

          // TIMESTAMP

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    const foreignKeyWorkerId = new TableForeignKey({
      columnNames: ['worker_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'workers',
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey('shifts', foreignKeyWorkerId);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shifts');
  }
}
