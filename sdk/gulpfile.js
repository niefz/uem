const gulp = require('gulp');
const sftp = require('gulp-sftp');

gulp.task('sftp', () => gulp
  .src([
    './dist/**',
  ])
  .pipe(
    sftp({
      port: '22',
      host: '10.16.148.102',
      user: 'apps',
      pass: 'oCK%!YF3IS',
      remotePath: '/apps/svr/apache/htdocs',
    }),
  )
  .pipe(
    sftp({
      port: '22',
      host: '10.16.148.103',
      user: 'apps',
      pass: 'oCK%!YF3IS',
      remotePath: '/apps/svr/apache/htdocs',
    }),
  ));
