import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { Tag, TagService } from '../../services/tag.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent implements OnInit, OnDestroy {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly tags = signal<Tag[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  private destroy$ = new Subject<void>();

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.loadTags();
  }

  ngOnDestroy(): void {}

  loadTags() {
    this.tagService
      .getTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ tags }) => {
          this.tags.update(() => tags);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addTag(event: MatChipInputEvent): void {
    const newTag = (event.value || '').trim().toLowerCase();

    const isTagExists = this.tags().find(
      ({ tag }) => tag.toLowerCase() === newTag
    );
    if (isTagExists) return;

    this.tagService
      .addTag(newTag)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.tags.update((tags) => [...tags, res]);
        },
        error: (error) => {
          console.log(error);
        },
      });

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const oldTags: Tag[] = [...this.tags()];

    // Optimistically remove the tag from the UI
    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        tags.splice(index, 1);
      }
      return [...tags];
    });

    this.announcer.announce(`Removed ${tag.tag}`);

    this.tagService
      .deleteTag(tag._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error(error);

          this.tags.update(() => oldTags);
        },
      });
  }

  edit(tag: Tag, event: MatChipEditedEvent) {
    const newTag = event.value.trim();

    if (!newTag) return;

    const oldTags: Tag[] = [...this.tags()];

    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        tags[index].tag = newTag;
        return [...tags];
      }
      return tags;
    });

    this.announcer.announce(`Edited ${tag.tag} to ${newTag}`);

    this.tagService
      .updateTag(tag._id, newTag)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.log(error);

          this.tags.update(() => oldTags);
        },
      });
  }
}
