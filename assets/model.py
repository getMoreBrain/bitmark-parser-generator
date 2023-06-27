

class AbstractQuestion(UuidBasedTimeStampedModel):
    KIND_BOOLEAN = 'bool'
    KIND_CHOICE = 'choice'
    KIND_MULTIPLE_CHOICE = 'multiple'
    KIND_TEXT = 'text'
    KIND_CATEGORIZER = 'categorizer'
    KIND_MULTIPLE_CATEGORIZER = 'multiple_categorizer'
    KIND_SORTER = 'sorter'
    KIND_CLOZE = 'cloze'
    KIND_HOTSPOT = 'hotspot'
    KIND_GAP = 'gap'
    KIND_ESSAY = 'essay'

    KIND_CHOICES = (
        (KIND_BOOLEAN, 'True/False'),
        (KIND_CHOICE, 'Choice'),
        (KIND_MULTIPLE_CHOICE, 'Multiple choice'),
        (KIND_TEXT, 'Text answer'),
        (KIND_CATEGORIZER, 'Categorizer'),
        (KIND_MULTIPLE_CATEGORIZER, 'Multiple categorizer'),
        (KIND_SORTER, 'Sorter'),
        (KIND_CLOZE, 'Cloze'),
        (KIND_HOTSPOT, 'Hotspot'),
        (KIND_GAP, 'Gap'),
        (KIND_ESSAY, 'Essay'),
    )

    title = models.CharField('Title', max_length=255)
    content = JSONField('Content', blank=True, null=True)
    raw_content = models.TextField('Raw content', blank=True, null=True)
    kind = models.CharField('Type', choices=KIND_CHOICES, max_length=24)
    explanation = JSONField('Explanation', blank=True, null=True)
    provider = models.CharField(max_length=64, blank=True, null=True)
    weight = models.DecimalField(max_digits=7, decimal_places=2, default=Decimal(1))
    video = models.URLField(blank=True, null=True)

    hotspot_data = JSONField('Hotspot data', blank=True, null=True)

    # Boolean: is True/False answer correct
    is_true_correct = models.NullBooleanField('Check if True is correct.', help_text='Only for True/False type.')

    gap_text = models.TextField('Gap text', blank=True, null=True)
    gaps = JSONField('Gaps', blank=True, null=True)

    is_onboarding = models.BooleanField(default=False)
    onboarding_id = models.CharField(max_length=64, blank=True, null=True)
    is_poll = models.BooleanField(default=False)
    license = models.CharField(max_length=256, null=True, blank=True, choices=[(enum, enum.value) for enum in License])

    tags = models.ManyToManyField(Tag, related_name='%(app_label)s_%(class)s_related')

    class Meta:
        abstract = True
        ordering = ('-created', )

    HOTSPOT_SCHEMA = Schema({
        'height':
        And(Use(int)),
        'width':
        And(Use(int)),
        'image':
        And(Use(str)),
        Optional('require_all', default=False):
        bool,
        'shapes':
        And([{
            'kind': And(Use(str)),
            Optional('points'): [{
                'x': And(Use(int)),
                'y': And(Use(int)),
            }],
        }]),
    })

class Question(ModelDiffMixin, AbstractQuestion):
    question_set = models.ForeignKey(QuestionSet, related_name='questions', blank=True, null=True)
    image = models.ForeignKey(Image, related_name='questions', blank=True, null=True, on_delete=models.SET_NULL)
    audio = models.ForeignKey(Audio, related_name='audios', blank=True, null=True, on_delete=models.SET_NULL)
    is_archived = models.BooleanField(default=False)
    derived_from = models.ForeignKey(
        'library.Question',
        null=True,
        blank=True,
        related_name='copies',
        on_delete=models.SET_NULL,
    )

    objects = QuestionManager()

    class Meta:
        order_with_respect_to = 'question_set'

    def __unicode__(self):
        return u'{kind} - {title}'.format(kind=self.get_kind_display(), title=self.title)

    def get_related_question_set(self):
        """Elasticsearch related instances"""
        return self.question_set

    def get_related_public_question_set(self):
        """Elasticsearch related instances"""
        return self.question_set.public_references.first()


class AbstractCategory(UuidBasedTimeStampedModel):
    content = JSONField(default={})

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'category {}'.format(self.id)


class AbstractCategoryItem(UuidBasedTimeStampedModel):
    content = JSONField(default={})

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'categorizer item {}'.format(self.id)


class Category(ModelDiffMixin, AbstractCategory):
    question = models.ForeignKey('library.Question', related_name='categories', verbose_name='Question')

    objects = CategoryManager()

    class Meta:
        order_with_respect_to = 'question'



class CategoryItem(CurriculumMixin, ModelDiffMixin, AbstractCategoryItem):
    question = models.ForeignKey('library.Question', related_name='items', verbose_name='Question')
    categories = models.ManyToManyField(Category, related_name='items', blank=True)

    objects = CategoryItemManager()

    class Meta:
        order_with_respect_to = 'question'



class AbstractChoice(UuidBasedTimeStampedModel):
    content = JSONField('Content', blank=True, null=True)
    # One/Multiple choice:
    is_correct = models.NullBooleanField(
        'Choice is correct',
        db_index=True,
        help_text='Only for Choice/Multiple choice question kinds. Must-have for auto check.',
    )

    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ('order', )
        abstract = True

    def __unicode__(self):
        return u'choice {}'.format(self.id)


class Choice(CurriculumMixin, ModelDiffMixin, AbstractChoice):
    question = models.ForeignKey('library.Question', related_name='choices', verbose_name='Question')
    image = models.ForeignKey(Image, related_name='choices', blank=True, null=True, on_delete=models.SET_NULL)

    objects = ChoiceManager()


class Cloze(ModelDiffMixin, UuidBasedTimeStampedModel):
    question = models.ForeignKey('library.Question', related_name='clozes', verbose_name='Question')

    objects = ClozeManager()

    class Meta:
        order_with_respect_to = 'question'



class ClozeChoice(CurriculumMixin, ModelDiffMixin, UuidBasedTimeStampedModel):
    cloze = models.ForeignKey(Cloze, related_name='choices', verbose_name='Cloze')
    question = models.ForeignKey('library.Question', related_name='cloze_choices', verbose_name='Question', null=True)

    content = models.TextField('Raw content', blank=True, null=True)
    is_correct = models.BooleanField(default=False)

    objects = ClozeChoiceManager()

    class Meta:
        order_with_respect_to = 'cloze'

    def __unicode__(self):
        return u'cloze-choice: {}'.format(self.id)




class QuestionSet(ModelDiffMixin, UuidBasedTimeStampedModel):
    PRIVACY_DEFAULT = 'default'
    PRIVACY_PROTECTED = 'protected'
    PRIVACY_MODERATION = 'moderation'
    PRIVACY_APPROVED = 'approved'
    PRIVACY_REJECTED = 'rejected'

    PRIVACY_CHOICES = (
        (PRIVACY_DEFAULT, 'Default'),    # Private, only owner can access and share.
        (PRIVACY_PROTECTED, 'Protected'),    # Owner can access but not share or publish.
        (PRIVACY_MODERATION, 'Moderation'),    # Submitted to public library, needs review.
        (PRIVACY_APPROVED, 'Approved'),    # Submitted to public library, approved.
        (PRIVACY_REJECTED, 'Rejected'),    # Submitted to public library, rejected.
    )

    title = models.CharField('Title', max_length=256)
    is_onboarding = models.BooleanField(default=False)

    privacy = models.CharField('Privacy', max_length=64, choices=PRIVACY_CHOICES, default=PRIVACY_DEFAULT)
    extra = models.TextField(blank=True, null=True)
    author = models.CharField(max_length=256, blank=True, null=True)
    description = models.CharField(max_length=256, blank=True, null=True)
    license = models.CharField(max_length=256, null=True, blank=True, choices=[(enum, enum.value) for enum in License])
    derived_from = models.ForeignKey(
        'library.QuestionSet',
        null=True,
        blank=True,
        related_name='copies',
        on_delete=models.SET_NULL,
    )

    solo_session = models.ForeignKey(
        'learn_sessions.Session',
        related_name='solo_question_set',
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )

    parent = models.ForeignKey(
        'library.Folder',
        related_name='question_sets',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    resource_pool = models.ForeignKey('library.ResourcePool', related_name='question_sets', on_delete=models.CASCADE)
    is_archived = models.BooleanField(default=False)

    objects = QuestionSetManager()

    class Meta:
        ordering = ('-created', )

    @property
    def questions_count(self):
        return self.active_questions.count()

    @property
    def kinds(self):
        return Counter(self.active_questions.values_list('kind', flat=True))

    @property
    def image(self):
        question = self.active_questions.filter(image__isnull=False).first()
        if question is not None:
            return question.image.get_image_preview()

        question_bank = getattr(self.resource_pool, 'question_bank', None)
        if question_bank is not None:
            return question_bank.image

        return None

    @property
    def active_questions(self):
        return self.questions.active.all()

    @property
    def tags(self):
        tags = set()
        for question in self.active_questions:
            tags.update(question.tags.all())
        return tags

    @property
    def all_tags(self):
        direct_tags = self.tags
        result = set()
        result.update(direct_tags)
        for tag in direct_tags:
            result.update(tag.parent_tags())
        return result

    def get_related_public_question_set(self):
        """Elasticsearch related instances"""
        return self.public_references.first()

    def reorder_questions(self, order):
        # Note: There seems to be no signal when the ordering changes. So we never call set_question_order directly
        #       but use this wrapper that resets the solo_session.
        self.solo_session = None
        self.set_question_order(order)
        self.save()

    def __unicode__(self):
        return u'QuestionSet: {title}'.format(title=self.title)


class QuestionSerializer(SerializerWithNestedMixin, BulkSerializerMixin, serializers.ModelSerializer):
    image = CloudinaryImageField('image', required=False, allow_null=True)
    image_details = serializers.SerializerMethodField()
    audio = CloudinaryAudioField('audio', required=False, allow_null=True)
    choices = ChoiceSerializer(many=True, required=False)
    categories = CategorySerializer(many=True, required=False)
    clozes = ClozeSerializer(many=True, required=False)
    items = CategoryItemSerializer(many=True, required=False)
    tags = TagField(many=True, queryset=Tag.objects.filter(is_leaf=True))
    last_modified = serializers.DateTimeField(required=False)
    locks = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            'id',
            'title',
            'image',
            'image_details',
            'content',
            'raw_content',
            'hotspot_data',
            'kind',
            'categories',
            'items',
            'explanation',
            'choices',
            'clozes',
            'is_true_correct',
            'modified',
            'created',
            'question_set',
            'weight',
            'is_poll',
            'video',
            'tags',
            'last_modified',
            'locks',
            'audio',
            'is_archived',
            'gap_text',
            'gaps',
        )
        nested_fields = ('choices', 'categories', 'items', 'clozes')
        list_serializer_class = BulkListSerializer

    def save(self, **kwargs):
        # For cases when serializer is used as nested
        if self.parent and isinstance(self.parent.instance, QuestionSet):
            kwargs['owner'] = self.parent.instance.owner

        return super(QuestionSerializer, self).save(**kwargs)

    def validate_hotspot_data(self, hotspot_data):
        try:
            Question.HOTSPOT_SCHEMA.validate(hotspot_data)
        except SchemaError, e:
            raise serializers.ValidationError(e)

        return hotspot_data

    def validate_gaps(self, gaps):
        if self.initial_data.get('kind') == Question.KIND_GAP:
            GapSerializer(data=gaps, many=True).is_valid(raise_exception=True)

        return gaps

    def validate(self, attrs):
        kind = attrs.get('kind')
        hotspot_data = attrs.get('hotspot_data')
        gap_text = attrs.get('gap_text')
        gaps = attrs.get('gaps')
        choices = attrs.get('choices')

        if kind == Question.KIND_HOTSPOT and not hotspot_data:
            raise serializers.ValidationError('Hotspot data is missing.')

        if kind == Question.KIND_GAP and not (gaps and gap_text):
            raise serializers.ValidationError('Gaps data is missing.')

        # validates choice, multiple choice and sorter question
        if choices and len(choices) < 2:
            raise serializers.ValidationError("Choices must have at least 2 items.")

        if attrs.get('question_set') is None:
            raise ValidationError('question_set is missing')

        return attrs

    def get_image_details(self, question):
        return ImageSerializer(question.image).data

    def get_locks(self, question):
        expired_at = timezone.now() - timedelta(minutes=LOCK_EXP_TIME_IN_MINS)
        return SoftLockSerializer(question.locks.filter(modified__gt=expired_at), many=True).data



class ChoiceSerializer(serializers.ModelSerializer):
    image = CloudinaryImageField('image', required=False, allow_null=True)

    class Meta:
        model = Choice
        fields = ('id', 'content', 'is_correct', 'order', 'image')



class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = (
            'id',
            'content',
        )

    def save(self, **kwargs):
        category = super(CategorySerializer, self).save(**kwargs)
        self.context['view'].temp_to_categories[self.initial_data['id']] = category.id
        return category


class ClozeSerializer(SerializerWithNestedMixin, serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    choices = ClozeChoiceSerializer(many=True, required=False)

    class Meta:
        model = Cloze
        fields = ('id', 'choices')
        nested_fields = ('choices', )

    def get_id(self, cloze):
        return str(cloze.id)

    def save(self, **kwargs):
        cloze = super(ClozeSerializer, self).save(**kwargs)
        key = self.initial_data['temporary_id']
        self.context['view'].temp_to_clozes[key] = cloze.id
        return cloze


class CategoryItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CategoryItem
        fields = ('id', 'content', 'categories')
        read_only_fields = ('categories', )

    def save(self, **kwargs):
        categories = []
        for category_id in self.initial_data['categories']:
            matched_category_id = self.context['view'].temp_to_categories.get(category_id)
            if matched_category_id is None:
                raise ValidationError('There is category {} which was not assigned to an item.'.format(category_id))
            else:
                categories.append(matched_category_id)
        self.validated_data['categories'] = categories
        item = super(CategoryItemSerializer, self).save(**kwargs)
        return item
