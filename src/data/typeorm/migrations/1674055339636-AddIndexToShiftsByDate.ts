import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexToShiftsByDate1674055339636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'shifts',
      new TableIndex({
        name: 'IDX_SHIFT_BY_WORK_DAY',
        columnNames: ['work_day'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('shifts', 'IDX_SHIFT_BY_WORK_DAY');
  }
}
