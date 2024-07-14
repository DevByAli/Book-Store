import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { BookService } from '../../services/book.service';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ProfileImageComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit, OnDestroy {
  bookForm!: FormGroup;
  selectedBookImage: File | null = null;
  preview: string = '';
  placeholder: string = 'https://www.marytribble.com/wp-content/uploads/2020/12/book-cover-placeholder.png';
  tags: string[] = [];
  isLoading: boolean = false;

  editBookId: string | null = null;
  editBookErrorMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      price: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      tags: [Array<string>(), [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(3000),
        ],
      ],
      url: [''],
      cloudinaryId: [''],
    });

    this.route.queryParamMap.subscribe((params) => {
      this.editBookId = params.get('id');
      if (this.editBookId) {
        this.loadBookDetails(this.editBookId);
      }
    });

    this.loadTags();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTags() {
    this.bookService
      .getBookTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ tags }) => {
          this.tags = tags.map(({ tag }) => tag);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onSelectImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        this.preview = ev.target?.result as string;
      };

      this.selectedBookImage = event.target.files[0];
    }
  }

  private openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  addOrEditBook() {
    if (this.bookForm.valid) {
      this.isLoading = true;

      if (this.selectedBookImage) {
        this.uploadBookImage()
          .pipe(
            takeUntil(this.destroy$),
            switchMap((res: any) => {
              if (res.body) {
                this.bookForm.patchValue({ url: res.body.url });
                this.bookForm.patchValue({
                  cloudinaryId: res.body.cloudinaryId,
                });

                const bookObservable = this.editBookId
                  ? this.bookService.updateBook(
                      this.editBookId,
                      this.bookForm.value
                    )
                  : this.bookService.uploadBook(this.bookForm.value);

                return bookObservable;
              } else {
                return of(null);
              }
            })
          )
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (res) => {
              if (res) {
                this.openSnackbar(
                  this.editBookId
                    ? 'Book Updated Successfully.'
                    : 'Book Added Successfully.',
                  'Dismiss'
                );
              }
            },
            error: ({ error }) => {
              this.openSnackbar(error.message, 'Dismiss');
            },
          });
      } else {
        const bookObservable = this.editBookId
          ? this.bookService.updateBook(this.editBookId, this.bookForm.value)
          : this.bookService.uploadBook(this.bookForm.value);

        bookObservable
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => (this.isLoading = false))
          )
          .subscribe({
            next: (res) => {
              if (res) {
                this.openSnackbar(
                  this.editBookId
                    ? 'Book Updated Successfully.'
                    : 'Book Added Successfully.',
                  'Dismiss'
                );
              }
            },
            error: ({ error }) => {
              this.openSnackbar(error.message, 'Dismiss');
            },
          });
      }
    }
  }

  uploadBookImage() {
    return this.bookService.uploadImage(this.selectedBookImage!);
  }

  deleteBookImage() {}

  getField(fieldName: HTMLInputElement | HTMLTextAreaElement) {
    return this.bookForm.get(fieldName.getAttribute('formcontrolname')!);
  }

  loadBookDetails(bookId: string) {
    this.bookService.getBook(bookId).subscribe({
      next: ({ book }) => {
        this.bookForm.patchValue(book);
        if (book.url) {
          this.preview = book.url;
        }
      },
      error: ({ error }) => {
        console.log(error);
        this.editBookErrorMessage = error.message;
      },
    });
  }
}
