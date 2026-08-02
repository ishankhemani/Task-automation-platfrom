# Backup and Recovery

## Database Backups (PostgreSQL)

It is highly recommended to perform regular backups of the PostgreSQL database.

### Automated Backups (Cron)
Create a cron job on your host server to dump the database daily:
```bash
0 2 * * * docker exec -t task_platform_postgres_prod pg_dumpall -c -U postgres > /path/to/backups/dump_$(date +\%Y-\%m-\%d).sql
```

### Manual Backup
```bash
docker exec -t task_platform_postgres_prod pg_dumpall -c -U postgres > dump_manual.sql
```

### Restoration
```bash
cat dump_manual.sql | docker exec -i task_platform_postgres_prod psql -U postgres
```

## Redis Persistence
Redis in this project is configured with `--appendonly yes` which provides AOF persistence.
Ensure the `redis_data_prod` Docker volume is backed up if you require strict retention of queued jobs across massive hardware failures.
