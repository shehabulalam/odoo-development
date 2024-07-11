odoo.define('website_student.s_student_profile_options', function (require) {
'use strict';

const options = require('web_editor.snippets.options');
const dynamicSnippetOptions = require('website.s_dynamic_snippet_options');

var wUtils = require('website.utils');

const dynamicSnippetStudentProfileOptions = dynamicSnippetOptions.extend({
    /**
     *
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.modelNameFilter = 'student.profile';
        this.blogs = {};
    },
    /**
     * @override
     */
    onBuilt() {
        this._super.apply(this, arguments);
        // TODO Remove in master.
        this.$target[0].dataset['snippet'] = 's_student_profile';
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     *
     * @override
     * @private
     */
    _computeWidgetVisibility: function (widgetName, params) {
        if (widgetName === 'hover_effect_opt') {
            return this.$target.get(0).dataset.templateKey === 'website_student.dynamic_filter_template_blog_post_big_picture';
        }
        return this._super.apply(this, arguments);
    },
    /**
     * Fetches blogs.
     * @private
     * @returns {Promise}
     */
    _fetchBlogs: function () {
        return this._rpc({
            model: 'blog.blog',
            method: 'search_read',
            kwargs: {
                domain: wUtils.websiteDomain(this),
                fields: ['id', 'name'],
            }
        });
    },
    /**
     * Fetches blogs.
     * @private
     * @returns {Promise}
     */
    _fetchStudents: function () {
        return this._rpc({
            model: 'college.info',
            method: 'search_read',
            kwargs: {
                domain: wUtils.websiteDomain(this),
                fields: ['id', 'name'],
            }
        });
    },
    /**
     *
     * @override
     * @private
     */
    _renderCustomXML: async function (uiFragment) {
        await this._super.apply(this, arguments);
        await this._renderBlogSelector(uiFragment);
    },
    /**
     * Renders the blog option selector content into the provided uiFragment.
     * @private
     * @param {HTMLElement} uiFragment
     */
    _renderBlogSelector: async function (uiFragment) {
        if (!Object.keys(this.blogs).length) {
            const blogsList = await this._fetchStudents();
            this.blogs = {};
            for (let index in blogsList) {
                this.blogs[blogsList[index].id] = blogsList[index];
            }
        }
        const blogSelectorEl = uiFragment.querySelector('[data-name="student_opt"]');
        return this._renderSelectUserValueWidgetButtons(blogSelectorEl, this.blogs);
    },
    /**
     * Sets default options values.
     * @override
     * @private
     */
    _setOptionsDefaultValues: function () {
        this._setOptionValue('filterByBlogId', -1);
        this._super.apply(this, arguments);
    },
});

options.registry.dynamic_snippet_student_profile = dynamicSnippetStudentProfileOptions;

return dynamicSnippetStudentProfileOptions;
});
