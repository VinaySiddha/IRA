import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Users,
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  CloudUpload,
  File,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { CATEGORIES } from '../utils/constants';

const steps = [
  { id: 1, title: 'Paper Details', icon: FileText },
  { id: 2, title: 'Authors', icon: Users },
  { id: 3, title: 'Upload PDF', icon: Upload },
  { id: 4, title: 'Review & Submit', icon: CheckCircle },
];

export default function PaperSubmit() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    category: '',
    authors: [{ name: '', affiliation: '', email: '', corresponding: true }],
    file: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setFormData({ ...formData, authors: newAuthors });
  };

  const addAuthor = () => {
    setFormData({
      ...formData,
      authors: [
        ...formData.authors,
        { name: '', affiliation: '', email: '', corresponding: false },
      ],
    });
  };

  const removeAuthor = (index) => {
    if (formData.authors.length === 1) return;
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prev) => ({ ...prev, file }));
    } else {
      toast.error('Please upload a PDF file');
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.abstract && formData.category;
      case 2:
        return formData.authors.every((a) => a.name && a.affiliation);
      case 3:
        return formData.file !== null;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Paper submitted successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">
            Submit Your <span className="gradient-text">Paper</span>
          </h1>
          <p className="text-text-muted">
            Follow the steps below to submit your manuscript for review.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300 border-2
                      ${
                        currentStep >= step.id
                          ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                          : 'bg-white text-text-muted border-border'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium hidden sm:block ${
                      currentStep >= step.id ? 'text-primary' : 'text-text-muted'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-primary to-secondary'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card hover={false} className="p-8">
              {/* Step 1: Paper Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-text mb-6">Paper Details</h2>

                  <Input
                    label="Paper Title"
                    name="title"
                    placeholder="Enter the full title of your paper"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                      Abstract <span className="text-error">*</span>
                    </label>
                    <textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleChange}
                      placeholder="Provide a concise summary of your research (250-500 words)"
                      rows={6}
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text placeholder:text-text-muted/50 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <Input
                    label="Keywords"
                    name="keywords"
                    placeholder="Comma-separated keywords (e.g., machine learning, NLP, transformers)"
                    value={formData.keywords}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                      Category <span className="text-error">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Authors */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text">Authors</h2>
                    <Button variant="outline" size="sm" icon={Plus} onClick={addAuthor}>
                      Add Author
                    </Button>
                  </div>

                  {formData.authors.map((author, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl border-2 border-border bg-gray-50/50 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-text">
                          Author {index + 1}
                          {author.corresponding && (
                            <Badge variant="primary" size="sm" className="ml-2">
                              Corresponding
                            </Badge>
                          )}
                        </h3>
                        {formData.authors.length > 1 && (
                          <button
                            onClick={() => removeAuthor(index)}
                            className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          placeholder="Dr. Jane Doe"
                          value={author.name}
                          onChange={(e) =>
                            handleAuthorChange(index, 'name', e.target.value)
                          }
                          required
                        />
                        <Input
                          label="Affiliation"
                          placeholder="University / Institution"
                          value={author.affiliation}
                          onChange={(e) =>
                            handleAuthorChange(index, 'affiliation', e.target.value)
                          }
                          required
                        />
                      </div>

                      <Input
                        label="Email"
                        type="email"
                        placeholder="author@university.edu"
                        value={author.email}
                        onChange={(e) =>
                          handleAuthorChange(index, 'email', e.target.value)
                        }
                      />

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={author.corresponding}
                          onChange={(e) =>
                            handleAuthorChange(
                              index,
                              'corresponding',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text-muted">
                          Corresponding author
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Upload PDF */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-text mb-6">Upload Manuscript</h2>

                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12
                      text-center transition-all duration-300 cursor-pointer
                      ${
                        dragOver
                          ? 'border-primary bg-primary/5 scale-[1.02]'
                          : formData.file
                          ? 'border-success bg-success/5'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {formData.file ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-success/10 flex items-center justify-center">
                          <File className="w-8 h-8 text-success" />
                        </div>
                        <p className="text-lg font-semibold text-text">
                          {formData.file.name}
                        </p>
                        <p className="text-sm text-text-muted">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ ...formData, file: null });
                          }}
                        >
                          Remove & Re-upload
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                          <CloudUpload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-text">
                          Drag & drop your PDF here
                        </p>
                        <p className="text-sm text-text-muted">
                          or click to browse files (PDF only, max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-text mb-6">
                    Review Your Submission
                  </h2>

                  {/* Paper Details Summary */}
                  <div className="p-6 rounded-xl bg-gray-50 space-y-3">
                    <h3 className="text-sm font-semibold uppercase text-text-muted tracking-wider">
                      Paper Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-text">Title:</span>{' '}
                        <span className="text-text-muted">
                          {formData.title || 'Not provided'}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-text">Category:</span>{' '}
                        <Badge variant="primary" size="sm">
                          {formData.category || 'Not selected'}
                        </Badge>
                      </p>
                      <p>
                        <span className="font-medium text-text">Abstract:</span>{' '}
                        <span className="text-text-muted text-sm">
                          {formData.abstract
                            ? `${formData.abstract.substring(0, 200)}...`
                            : 'Not provided'}
                        </span>
                      </p>
                      {formData.keywords && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.keywords.split(',').map((kw, i) => (
                            <Badge key={i} variant="secondary" size="sm">
                              {kw.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Authors Summary */}
                  <div className="p-6 rounded-xl bg-gray-50 space-y-3">
                    <h3 className="text-sm font-semibold uppercase text-text-muted tracking-wider">
                      Authors
                    </h3>
                    {formData.authors.map((author, index) => (
                      <p key={index} className="text-text-muted">
                        <span className="font-medium text-text">{author.name || 'Unnamed'}</span>
                        {author.affiliation && ` - ${author.affiliation}`}
                        {author.corresponding && (
                          <Badge variant="primary" size="sm" className="ml-2">
                            Corresponding
                          </Badge>
                        )}
                      </p>
                    ))}
                  </div>

                  {/* File Summary */}
                  <div className="p-6 rounded-xl bg-gray-50 space-y-3">
                    <h3 className="text-sm font-semibold uppercase text-text-muted tracking-wider">
                      Manuscript File
                    </h3>
                    {formData.file ? (
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-success" />
                        <span className="text-text font-medium">
                          {formData.file.name}
                        </span>
                        <span className="text-text-muted text-sm">
                          ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <p className="text-error">No file uploaded</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            icon={ChevronLeft}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              icon={ChevronRight}
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              disabled={!canProceed()}
            >
              Next Step
            </Button>
          ) : (
            <Button
              icon={CheckCircle}
              loading={loading}
              onClick={handleSubmit}
              disabled={!formData.file}
            >
              Submit Paper
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
