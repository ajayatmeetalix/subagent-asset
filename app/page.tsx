"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Home, Briefcase, FileText, Trash2, Users, Building2, Copy, ChevronRight, Download, Plus, Menu, RefreshCw, User, CreditCard, DollarSign, Lock, Clipboard, UserCircle, BarChart3, FileCheck, UserPlus, CircleDollarSign, MousePointer, FolderOpen, Search, Edit, Folder, Grid, Upload, FolderPlus, MoreVertical, Trash, Edit2, X, File, CheckCircle, Image, FileImage, FolderInput, Eye, CalendarDays, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DEADLINE_CATEGORIES = [
  {
    key: "immediate",
    label: "Immediate actions",
    subtitle: "First 30 days from death",
    triggerLabel: "Date of death",
    triggerKeyword: "closed won",
    preview: ["Secure assets", "Notify beneficiaries", "Lodge will with court"],
    items: [
      { title: "Secure and inventory assets", defaultValue: 30, unit: "days" as const, description: "Identify, secure, and document all estate assets before they can be lost, stolen, or deteriorate in value." },
      { title: "Notify beneficiaries", defaultValue: 30, unit: "days" as const, description: "Inform all named beneficiaries of the death and their interest in the estate." },
      { title: "Lodge original will with court", defaultValue: 30, unit: "days" as const, description: "File the original will with the probate court. Most states require this within 30 days of learning of the death." },
      { title: "Notify financial institutions", defaultValue: 30, unit: "days" as const, description: "Alert banks, brokerages, and financial institutions of the death to prevent unauthorized access." },
    ]
  },
  {
    key: "probate",
    label: "Opening probate",
    subtitle: "30–60 days from death",
    triggerLabel: "Date of death",
    triggerKeyword: "closed won",
    preview: ["File petition", "Serve notice to heirs", "Publish notice"],
    items: [
      { title: "File petition to open probate", defaultValue: 30, unit: "days" as const, description: "File petition with the probate court to begin formal estate administration." },
      { title: "Serve notice of petition to heirs", defaultValue: 45, unit: "days" as const, description: "Serve all heirs and beneficiaries with notice of the petition before the court hearing." },
      { title: "Publish notice in newspaper", defaultValue: 45, unit: "days" as const, description: "Publish notice of probate proceedings in a newspaper of general circulation in the county." },
      { title: "File probate notes / examiner review", defaultValue: 50, unit: "days" as const, description: "Submit required probate notes or examiner review documents before the scheduled hearing." },
    ]
  },
  {
    key: "creditor",
    label: "Creditor claim window",
    subtitle: "From letters issuance",
    triggerLabel: "Letters issued",
    triggerKeyword: "letters",
    preview: ["Notify known creditors", "Creditor claim period", "Allow or reject claims"],
    items: [
      { title: "Notify known creditors", defaultValue: 30, unit: "days" as const, description: "Send written notice of the death to all known creditors of the estate." },
      { title: "File inventory and appraisal", defaultValue: 120, unit: "days" as const, description: "File a complete inventory and appraisal of all estate assets with the court." },
      { title: "Creditor claim period closes", defaultValue: 4, unit: "months" as const, description: "The deadline by which all creditors must file claims. No final distribution can occur until this window closes." },
      { title: "Allow or reject each creditor claim", defaultValue: 30, unit: "days" as const, description: "The executor must formally allow or reject each creditor claim filed. Failure to respond may constitute automatic allowance." },
    ]
  },
  {
    key: "small-estate",
    label: "Small estate affidavit",
    subtitle: "Waiting period from death",
    triggerLabel: "Date of death",
    triggerKeyword: "closed won",
    preview: ["Mandatory waiting period", "File small estate affidavit"],
    items: [
      { title: "Minimum waiting period before filing", defaultValue: 40, unit: "days" as const, description: "Mandatory waiting period before a small estate affidavit can be submitted. Filing before this window will result in rejection." },
    ]
  },
  {
    key: "tax",
    label: "Tax returns",
    subtitle: "Calendar-based deadlines",
    triggerLabel: "Date of death",
    triggerKeyword: "closed won",
    preview: ["Final Form 1040", "Form 706 (estate tax)", "Form 1041"],
    items: [
      { title: "Final Form 1040 (personal income tax)", defaultValue: 270, unit: "days" as const, description: "Due April 15 of the year following death. Adjust the calculated date to the actual April 15 deadline." },
      { title: "Form 706 (federal estate tax return)", defaultValue: 270, unit: "days" as const, description: "Due 9 months from date of death. Only required for estates exceeding the federal exemption threshold." },
      { title: "Form 1041 (estate income tax return)", defaultValue: 270, unit: "days" as const, description: "Due April 15 if the estate earns $600 or more in gross income during administration." },
    ]
  },
  {
    key: "trust",
    label: "Trust administration",
    subtitle: "From death or trust event",
    triggerLabel: "Date of death",
    triggerKeyword: "closed won",
    preview: ["Notice to beneficiaries", "Contest window", "Inventory assets"],
    items: [
      { title: "Notice to trust beneficiaries", defaultValue: 60, unit: "days" as const, description: "The trustee must notify all beneficiaries and heirs of the trust's existence and their rights." },
      { title: "Beneficiary trust contest window", defaultValue: 120, unit: "days" as const, description: "Window for beneficiaries to contest the trust, typically measured from when notice was mailed." },
      { title: "File inventory of trust assets", defaultValue: 120, unit: "days" as const, description: "Compile and file a complete inventory of all assets held within the trust." },
    ]
  },
  {
    key: "will-contest",
    label: "Will contests",
    subtitle: "From probate filing",
    triggerLabel: "Date of death",
    triggerKeyword: "closed won",
    preview: ["Will contest deadline"],
    items: [
      { title: "Will contest deadline", defaultValue: 90, unit: "days" as const, description: "Deadline for any interested party to contest the validity of the will. This window varies significantly by state." },
    ]
  },
]

export default function EstateManagementPage() {
  const [activeNav, setActiveNav] = useState("home")
  const [displayTestEstates, setDisplayTestEstates] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile
  const [selectedEstate, setSelectedEstate] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("assets")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [folders, setFolders] = useState<Record<string, Array<{ name: string; modified: string }>>>({
    root: [
      { name: "Executor Documents", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Beneficiary Documents", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Partner Documents", modified: "Mon Nov 4 2024 by Alix" }
    ],
    "Executor Documents": [
      { name: "Accounts", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Cherished Memories", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Debts & Obligations", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Estate Settlements Docs", modified: "Wed Nov 6 2024 by Jolene Smith" },
      { name: "Fraud Notifications", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Miscellaneous", modified: "Mon Nov 4 2024 by Alix" },
      { name: "My Uploads", modified: "Thu May 29 2025 by MeetAlix" },
      { name: "Probate", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Real Estate", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Tax Documents", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Vehicles", modified: "Mon Nov 4 2024 by Alix" }
    ],
    "Beneficiary Documents": [],
    "Partner Documents": []
  })
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editingFileValue, setEditingFileValue] = useState("")
  const [deleteFileConfirm, setDeleteFileConfirm] = useState<string | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [fileToMove, setFileToMove] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewFile, setPreviewFile] = useState<{ name: string; type: string } | null>(null)
  const [vaultFolder, setVaultFolder] = useState<string | null>(null)
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false)
  const [newMilestoneName, setNewMilestoneName] = useState("")
  const [newMilestoneDate, setNewMilestoneDate] = useState("")
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("")
  const [newMilestoneAssignedTo, setNewMilestoneAssignedTo] = useState("")
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      name: "Closed WON",
      date: "Oct 12, 2024",
      assignedTo: "System",
      description: "Estate case accepted and initiated."
    },
    {
      id: 2,
      name: "K.Y.C.",
      date: "Nov 1, 2024",
      assignedTo: "Jolene Smith",
      description: "Know Your Customer verification completed."
    },
    {
      id: 3,
      name: "Determine Legal Path",
      date: "Feb 1, 2025",
      assignedTo: "Clayton Noyes",
      description: "Legal pathway for estate administration determined."
    },
    {
      id: 4,
      name: "File Tax Return",
      date: "Jul 12, 2025",
      assignedTo: "Unassigned",
      description: "Estate tax return filed with appropriate authorities."
    }
  ])

  // Deadlines state
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState(false)
  // Two-step modal state
  const [deadlineModalStep, setDeadlineModalStep] = useState<1 | 2>(1)
  const [deadlineModalTrigger, setDeadlineModalTrigger] = useState<string | null>(null)
  // Checklist of selected items (all pre-checked by default)
  const [deadlineModalChecked, setDeadlineModalChecked] = useState<string[]>([])
  // Per-item window overrides (item title → value in unit)
  const [deadlineModalWindowOverrides, setDeadlineModalWindowOverrides] = useState<Record<string, number>>({})
  // Custom path state
  const [newDeadlineTitle, setNewDeadlineTitle] = useState("")
  const [newDeadlineDueDate, setNewDeadlineDueDate] = useState("")
  const [newDeadlineAssignedTo, setNewDeadlineAssignedTo] = useState("")
  const [newDeadlineDescription, setNewDeadlineDescription] = useState("")
  const [newDeadlineTrigger, setNewDeadlineTrigger] = useState("")
  const [newDeadlineWindow, setNewDeadlineWindow] = useState("")
  const [deadlines, setDeadlines] = useState<Array<{
    id: number
    title: string
    trigger: string
    window: string
    dueDate: string
    assignedTo: string
    description: string
    completed: boolean
    completedAt: string | undefined
  }>>([
    {
      id: 1,
      title: "Notify FTB of death",
      trigger: "Letters issued",
      window: "90 days",
      dueDate: "2025-04-01",
      assignedTo: "Clayton Noyes",
      description: "Send written notice of death to the Franchise Tax Board along with a copy of the letters.",
      completed: false,
      completedAt: undefined
    },
    {
      id: 2,
      title: "Creditor claim period closes",
      trigger: "Letters issued",
      window: "4 months",
      dueDate: "2025-06-15",
      assignedTo: "Jolene Smith",
      description: "Final date by which all creditors must file claims against the estate. No final distribution can occur until this window closes.",
      completed: false,
      completedAt: undefined
    }
  ])

  // File structure with files in folders
  const [files, setFiles] = useState<Record<string, Array<{ name: string; type: string; size: string; modified: string }>>>({
    "Accounts": [
      { name: "Bank_Statement_Jan2024.png", type: "image/png", size: "2.3 MB", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Investment_Account_Summary.pdf", type: "application/pdf", size: "1.1 MB", modified: "Tue Nov 5 2024 by Alix" },
      { name: "Retirement_Account_Details.pdf", type: "application/pdf", size: "856 KB", modified: "Mon Nov 4 2024 by Alix" },
    ],
    "Real Estate": [
      { name: "Property_Deed.pdf", type: "application/pdf", size: "3.2 MB", modified: "Wed Nov 6 2024 by Jolene Smith" },
      { name: "Home_Appraisal.pdf", type: "application/pdf", size: "1.8 MB", modified: "Wed Nov 6 2024 by Jolene Smith" },
      { name: "Property_Photo_Front.jpg", type: "image/jpeg", size: "4.5 MB", modified: "Mon Nov 4 2024 by Alix" },
    ],
    "Estate Settlements Docs": [
      { name: "Death_Certificate.pdf", type: "application/pdf", size: "425 KB", modified: "Wed Nov 6 2024 by Jolene Smith" },
      { name: "Will_Final.pdf", type: "application/pdf", size: "1.2 MB", modified: "Wed Nov 6 2024 by Jolene Smith" },
      { name: "Trust_Documents.pdf", type: "application/pdf", size: "2.1 MB", modified: "Wed Nov 6 2024 by Jolene Smith" },
    ],
    "Tax Documents": [
      { name: "Tax_Return_2023.pdf", type: "application/pdf", size: "892 KB", modified: "Mon Nov 4 2024 by Alix" },
      { name: "W2_Form_2023.pdf", type: "application/pdf", size: "245 KB", modified: "Mon Nov 4 2024 by Alix" },
    ],
    "Vehicles": [
      { name: "Car_Title.pdf", type: "application/pdf", size: "654 KB", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Vehicle_Registration.jpg", type: "image/jpeg", size: "1.2 MB", modified: "Mon Nov 4 2024 by Alix" },
    ],
  })

  const estates = [
    {
      id: "862831cb-8e8d-44b5-bde5-03583031d3cb",
      shortId: "862831cb-8e8d-...",
      name: "Microsoft Zune",
      executors: [],
      status: "Active",
      createdAt: "12/18/2025",
      assignedTo: "None assigned",
      email: "estateof.rew5tgg.dev1@meetalix.com",
      scanBoxId: "00000025b",
      assets: [
        {
          type: "Primary Residence",
          address: "104 North Broadway",
          city: "Pennsville Township",
          state: "NJ",
          value: "$__.__",
          status: "Pending"
        }
      ]
    },
    {
      id: "34935a92-4667-...",
      shortId: "34935a92-4667-...",
      name: "Luke Skywalker",
      executors: ["Lea Skywalker"],
      status: "Churned",
      createdAt: "10/22/2024",
      assignedTo: "Clayton Noyes",
      email: "luke.skywalker@meetalix.com",
      assets: []
    },
    {
      id: "168a8b40-df79-...",
      shortId: "168a8b40-df79-...",
      name: "Bunny2 Folger",
      executors: ["Tim Timson"],
      status: "Active",
      createdAt: "09/14/2023",
      assignedTo: "None assigned",
      email: "bunny.folger@meetalix.com",
      assets: []
    },
    {
      id: "3668ef06-ca44-...",
      shortId: "3668ef06-ca44-...",
      name: "Admiral Holdo",
      executors: [],
      status: "Active",
      createdAt: "09/22/2023",
      assignedTo: "None assigned",
      email: "admiral.holdo@meetalix.com",
      assets: []
    },
    {
      id: "608454fd-aeea-...",
      shortId: "608454fd-aeea-...",
      name: "Mary Wright",
      executors: ["Lakisha Robinson"],
      status: "Active",
      createdAt: "05/27/2025",
      assignedTo: "None assigned",
      email: "mary.wright@meetalix.com",
      assets: []
    },
    {
      id: "93a1d97c-80f2-4...",
      shortId: "93a1d97c-80f2-4...",
      name: "Elvis Presley",
      executors: ["Don Donato", "Priscila Presley"],
      status: "Active",
      createdAt: "02/12/2025",
      assignedTo: "None assigned",
      email: "elvis.presley@meetalix.com",
      assets: []
    },
    {
      id: "3906ba77-d42d-...",
      shortId: "3906ba77-d42d-...",
      name: "Date Death",
      executors: [],
      status: "Active",
      createdAt: "12/02/2025",
      assignedTo: "None assigned",
      email: "date.death@meetalix.com",
      assets: []
    },
    {
      id: "430ce962-c0bd-...",
      shortId: "430ce962-c0bd-...",
      name: "Ping Li",
      executors: [],
      status: "Active",
      createdAt: "05/30/2025",
      assignedTo: "None assigned",
      email: "ping.li@meetalix.com",
      assets: []
    },
    {
      id: "43e4107b-9320-...",
      shortId: "43e4107b-9320-...",
      name: "Afterrevert Boxintegration",
      executors: [],
      status: "Active",
      createdAt: "12/02/2025",
      assignedTo: "None assigned",
      email: "afterrevert@meetalix.com",
      assets: []
    },
    {
      id: "298a0f50-64ac-...",
      shortId: "298a0f50-64ac-...",
      name: "Wayne Kearns",
      executors: ["Sharra Romany"],
      status: "Active",
      createdAt: "05/07/2025",
      assignedTo: "None assigned",
      email: "wayne.kearns@meetalix.com",
      assets: []
    },
    {
      id: "e3387c69-2a3a-...",
      shortId: "e3387c69-2a3a-...",
      name: "New Box",
      executors: [],
      status: "Active",
      createdAt: "06/12/2025",
      assignedTo: "None assigned",
      email: "newbox@meetalix.com",
      assets: []
    },
    {
      id: "12b54d34-344a-...",
      shortId: "12b54d34-344a-...",
      name: "Emperor Palpatine",
      executors: [],
      status: "Active",
      createdAt: "07/06/2023",
      assignedTo: "David Tuffy, Sharif Nasr",
      email: "emperor@meetalix.com",
      assets: []
    },
  ]

  // Folder management functions
  const handleRenameFolder = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) {
      setEditingFolder(null)
      return
    }

    const location = currentFolder || "root"
    const updatedFolders = { ...folders }
    
    // Update folder name in current location
    if (updatedFolders[location]) {
      updatedFolders[location] = updatedFolders[location].map(folder =>
        folder.name === oldName
          ? { ...folder, name: newName, modified: new Date().toLocaleString() + " by You" }
          : folder
      )
    }

    // If renaming a parent folder, update its key in the folders object
    if (updatedFolders[oldName]) {
      updatedFolders[newName] = updatedFolders[oldName]
      delete updatedFolders[oldName]
    }

    setFolders(updatedFolders)
    setEditingFolder(null)
  }

  const handleDeleteFolder = (folderName: string) => {
    const location = currentFolder || "root"
    const updatedFolders = { ...folders }
    
    // Remove folder from current location
    if (updatedFolders[location]) {
      updatedFolders[location] = updatedFolders[location].filter(
        folder => folder.name !== folderName
      )
    }

    // Remove folder's contents if it exists
    if (updatedFolders[folderName]) {
      delete updatedFolders[folderName]
    }

    setFolders(updatedFolders)
    setDeleteConfirm(null)
  }

  // File upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...filesArray])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files)
      setUploadedFiles(prev => [...prev, ...filesArray])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadComplete = () => {
    // Here you would typically upload files to a server
    console.log('Uploading files:', uploadedFiles)
    
    // Reset and close modal
    setUploadedFiles([])
    setShowUploadModal(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // File management functions
  const handleRenameFile = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName || !currentFolder) {
      setEditingFile(null)
      return
    }

    const updatedFiles = { ...files }
    if (updatedFiles[currentFolder]) {
      updatedFiles[currentFolder] = updatedFiles[currentFolder].map(file =>
        file.name === oldName
          ? { ...file, name: newName, modified: new Date().toLocaleString() + " by You" }
          : file
      )
    }

    setFiles(updatedFiles)
    setEditingFile(null)
  }

  const handleDeleteFile = (fileName: string) => {
    if (!currentFolder) return

    const updatedFiles = { ...files }
    if (updatedFiles[currentFolder]) {
      updatedFiles[currentFolder] = updatedFiles[currentFolder].filter(
        file => file.name !== fileName
      )
    }

    setFiles(updatedFiles)
    setDeleteFileConfirm(null)
  }

  const handleMoveFile = (fileName: string, destinationFolder: string) => {
    if (!currentFolder || currentFolder === destinationFolder) {
      setShowMoveModal(false)
      setFileToMove(null)
      return
    }

    const updatedFiles = { ...files }
    
    // Find the file in current folder
    const fileToMove = updatedFiles[currentFolder]?.find(f => f.name === fileName)
    if (!fileToMove) return

    // Remove from current folder
    if (updatedFiles[currentFolder]) {
      updatedFiles[currentFolder] = updatedFiles[currentFolder].filter(
        file => file.name !== fileName
      )
    }

    // Add to destination folder
    if (!updatedFiles[destinationFolder]) {
      updatedFiles[destinationFolder] = []
    }
    updatedFiles[destinationFolder].push({
      ...fileToMove,
      modified: new Date().toLocaleString() + " by You"
    })

    setFiles(updatedFiles)
    setShowMoveModal(false)
    setFileToMove(null)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-blue-500 flex-shrink-0" />
    }
    if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
    }
    return <File className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
  }

  const handlePreviewFile = (fileName: string, fileType: string) => {
    setPreviewFile({ name: fileName, type: fileType })
    setShowPreviewModal(true)
  }

  const handleDownloadFile = (fileName: string) => {
    alert(`Downloading ${fileName}`)
  }

  const handleAddMilestone = () => {
    if (!newMilestoneName || !newMilestoneDate) {
      alert("Please fill in at least the name and date fields")
      return
    }

    const newMilestone = {
      id: milestones.length + 1,
      name: newMilestoneName,
      date: newMilestoneDate,
      assignedTo: newMilestoneAssignedTo || "Unassigned",
      description: newMilestoneDescription || ""
    }

    setMilestones([...milestones, newMilestone])
    
    // Reset form
    setNewMilestoneName("")
    setNewMilestoneDate("")
    setNewMilestoneDescription("")
    setNewMilestoneAssignedTo("")
    setShowAddMilestoneModal(false)
  }

  // Deadline urgency helper
  const getDeadlineUrgency = (dueDate: string, completed: boolean) => {
    if (completed) return { label: "Completed", color: "bg-green-100 text-green-700" }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0)  return { label: `${Math.abs(diffDays)}d overdue`, color: "bg-red-100 text-red-700" }
    if (diffDays <= 3) return { label: `${diffDays}d left`, color: "bg-orange-100 text-orange-700" }
    if (diffDays <= 7) return { label: `${diffDays}d left`, color: "bg-amber-100 text-amber-700" }
    if (diffDays <= 30) return { label: `${diffDays}d left`, color: "bg-blue-100 text-blue-700" }
    return { label: `${diffDays}d left`, color: "bg-[#ebe9e6] text-[#6b675f]" }
  }

  const resetDeadlineModal = () => {
    setShowAddDeadlineModal(false)
    setDeadlineModalStep(1)
    setDeadlineModalTrigger(null)
    setDeadlineModalChecked([])
    setDeadlineModalWindowOverrides({})
    setNewDeadlineTitle("")
    setNewDeadlineDueDate("")
    setNewDeadlineAssignedTo("")
    setNewDeadlineDescription("")
    setNewDeadlineTrigger("")
    setNewDeadlineWindow("")
  }

  // Calculate due date from a milestone date string (e.g. "Mar 1, 2025") and a window string
  const calcDueDate = (milestoneDate: string, window: string): string => {
    try {
      let base: Date
      // Try parsing "MMM d, yyyy" first, then ISO
      try { base = new Date(milestoneDate) } catch { return "" }
      if (isNaN(base.getTime())) return ""
      const lower = window.toLowerCase()
      const numMatch = lower.match(/(\d+)/)
      const num = numMatch ? parseInt(numMatch[1]) : 0
      if (lower.includes("month")) {
        const d = new Date(base)
        d.setMonth(d.getMonth() + num)
        return format(d, "yyyy-MM-dd")
      }
      if (lower.includes("day")) {
        const d = new Date(base)
        d.setDate(d.getDate() + num)
        return format(d, "yyyy-MM-dd")
      }
      return ""
    } catch { return "" }
  }

  // Look up a milestone date from the milestones list by name keyword
  const getMilestoneDate = (keyword: string): string => {
    const m = milestones.find(m => m.name.toLowerCase().includes(keyword.toLowerCase()))
    return m?.date ?? ""
  }

  const handleAddDeadline = () => {
    if (deadlineModalTrigger === "custom") {
      if (!newDeadlineTitle || !newDeadlineDueDate) {
        alert("Please fill in at least the title and due date.")
        return
      }
      setDeadlines(prev => [...prev, {
        id: Date.now(),
        title: newDeadlineTitle,
        trigger: newDeadlineTrigger || "Custom",
        window: newDeadlineWindow || "",
        dueDate: newDeadlineDueDate,
        assignedTo: newDeadlineAssignedTo || "Unassigned",
        description: newDeadlineDescription || "",
        completed: false,
        completedAt: undefined
      }])
      resetDeadlineModal()
      return
    }

    const category = DEADLINE_CATEGORIES.find(c => c.key === deadlineModalTrigger)
    if (!category) return

    const milestoneDate = getMilestoneDate(category.triggerKeyword)

    const toAdd = category.items
      .filter(item => deadlineModalChecked.includes(item.title))
      .map((item) => {
        const overriddenValue = deadlineModalWindowOverrides[item.title] ?? item.defaultValue
        const windowStr = `${overriddenValue} ${item.unit}`
        return {
          id: Date.now() + Math.random(),
          title: item.title,
          trigger: category.triggerLabel,
          window: windowStr,
          dueDate: milestoneDate ? calcDueDate(milestoneDate, windowStr) : "",
          assignedTo: "Unassigned",
          description: item.description,
          completed: false,
          completedAt: undefined as string | undefined
        }
      })

    if (toAdd.length === 0) return
    setDeadlines(prev => [...prev, ...toAdd])
    resetDeadlineModal()
  }

  const handleToggleDeadlineComplete = (id: number) => {
    setDeadlines(deadlines.map(d =>
      d.id === id
        ? { ...d, completed: !d.completed, completedAt: !d.completed ? new Date().toISOString() : undefined }
        : d
    ))
  }

  // Document folder structure
  const documentFolders = {
    root: [
      { name: "Executor Documents", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Beneficiary Documents", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Partner Documents", modified: "Mon Nov 4 2024 by Alix" }
    ],
    "Executor Documents": [
      { name: "Accounts", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Cherished Memories", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Debts & Obligations", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Estate Settlements Docs", modified: "Wed Nov 6 2024 by Jolene Smith" },
      { name: "Fraud Notifications", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Miscellaneous", modified: "Mon Nov 4 2024 by Alix" },
      { name: "My Uploads", modified: "Thu May 29 2025 by MeetAlix" },
      { name: "Probate", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Real Estate", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Tax Documents", modified: "Mon Nov 4 2024 by Alix" },
      { name: "Vehicles", modified: "Mon Nov 4 2024 by Alix" }
    ],
    "Beneficiary Documents": [],
    "Partner Documents": []
  }

  // Estate Detail View
  if (selectedEstate) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        {/* Dark Header Bar */}
        <header className="bg-[#3d3d3d] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-1 hover:bg-[#4d4d4d] rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-semibold truncate">Estate of {selectedEstate.name}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs text-gray-400 hidden sm:inline">release/2025-12-30#2 | 44fecdd</span>
            <button className="p-1 hover:bg-[#4d4d4d] rounded transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-1 hover:bg-[#4d4d4d] rounded transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Estate Detail Sidebar */}
          <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-64 bg-[#d8d4ce] flex flex-col border-r border-[#c0bcb6] transition-transform duration-300 h-full`}>
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
              <button
                onClick={() => { setSelectedEstate(null); setActiveNav("home"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]`}
                title="Home"
              >
                <Home className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Home</span>
              </button>
              <button
                onClick={() => { setActiveNav("jobs-board"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "jobs-board" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Jobs Board"
              >
                <Briefcase className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Jobs Board</span>
              </button>
              <button
                onClick={() => { setActiveNav("documents"); setCurrentFolder(null); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "documents" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Documents"
              >
                <Folder className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Documents</span>
              </button>
              <button
                onClick={() => { setActiveNav("timeline"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "timeline" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Estate Timeline"
              >
                <CalendarDays className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Estate Timeline</span>
              </button>
              <button
                onClick={() => { setActiveNav("assets"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "assets" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Assets"
              >
                <Building2 className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Assets</span>
              </button>
              <button
                onClick={() => { setActiveNav("debts"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "debts" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Debts"
              >
                <CreditCard className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Debts</span>
              </button>
              <button
                onClick={() => { setActiveNav("expenses"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "expenses" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Expenses"
              >
                <DollarSign className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Expenses</span>
              </button>
              <button
                onClick={() => { setActiveNav("obligations"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "obligations" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Obligations"
              >
                <Lock className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Obligations</span>
              </button>
              <button
                onClick={() => { setActiveNav("other-components"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "other-components" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Other Components"
              >
                <Clipboard className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Other Components</span>
              </button>
              <button
                onClick={() => { setActiveNav("contacts"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "contacts" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Contacts"
              >
                <UserCircle className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Contacts</span>
              </button>
              <button
                onClick={() => { setActiveNav("operating-bank"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "operating-bank" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Operating Bank Accounts"
              >
                <BarChart3 className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Operating Bank Accounts</span>
              </button>
              <button
                onClick={() => { setActiveNav("flexible-spending"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "flexible-spending" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Flexible Spending Accounts"
              >
                <CircleDollarSign className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Flexible Spending Accounts</span>
              </button>
              <button
                onClick={() => { setActiveNav("action-cards"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "action-cards" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Action Cards"
              >
                <FileCheck className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Action Cards</span>
              </button>
              <button
                onClick={() => { setActiveNav("care-team-notes"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "care-team-notes" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Care Team Notes"
              >
                <FileText className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Care Team Notes</span>
              </button>
              <button
                onClick={() => { setActiveNav("discovery-agent"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "discovery-agent" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Discovery Agent"
              >
                <Search className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Discovery Agent</span>
              </button>
              <button
                onClick={() => { setActiveNav("content-cards"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "content-cards" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Content Cards"
              >
                <FolderOpen className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Content Cards</span>
              </button>
              <button
                onClick={() => { setActiveNav("assign-team"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "assign-team" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Assign Team Member"
              >
                <UserPlus className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Assign Team Member</span>
              </button>
              <button
                onClick={() => { setActiveNav("fee-manager"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "fee-manager" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Fee Manager"
              >
                <CircleDollarSign className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Fee Manager</span>
              </button>
              <button
                onClick={() => { setActiveNav("clickup"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "clickup" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="ClickUp"
              >
                <MousePointer className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">ClickUp</span>
              </button>
              <button
                onClick={() => { setActiveNav("manage-users-estate"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                  activeNav === "manage-users-estate" ? "bg-[#ececec] text-[#3d3d3d]" : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
                }`}
                title="Manage Users on Estate"
              >
                <Users className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13px] whitespace-nowrap">Manage Users on Estate</span>
              </button>
            </nav>
          </aside>

          {/* Estate Detail Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#f8f7f5]">
            {activeNav === "documents" ? (
              // Documents View
              <>
                {/* Documents Header */}
                <div className="bg-white border-b border-[#d4cfca] px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2 mb-4">
                    {currentFolder && (
                      <>
                        <button
                          onClick={() => setCurrentFolder(null)}
                          className="text-[#8b7d6f] hover:text-[#2d2d2d] text-sm"
                        >
                          Documents
                        </button>
                        <ChevronRight className="w-4 h-4 text-[#8b7d6f]" />
                      </>
                    )}
                    <h2 className="text-base sm:text-lg font-semibold text-[#2d2d2d] truncate">
                      {currentFolder || "Documents"}
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 w-full">
                      <Input
                        type="text"
                        placeholder="Search files and folders"
                        className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#9b9b9b]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-[#f8f7f5] rounded transition-colors" title="Grid view">
                        <Grid className="w-5 h-5 text-[#6b675f]" />
                      </button>
                      <Button 
                        onClick={() => setShowUploadModal(true)}
                        className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9 flex-1 sm:flex-initial"
                      >
                        <Upload className="w-4 h-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">Upload</span>
                      </Button>
                      <Button className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9 flex-1 sm:flex-initial">
                        <Plus className="w-4 h-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">New Folder</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Upload Modal */}
                {showUploadModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#e5e5e5]">
                        <div>
                          <h2 className="text-lg font-semibold text-[#3d3d3d]">Upload Documents</h2>
                          <p className="text-xs text-[#6b675f] mt-1">
                            Upload to: {currentFolder || "Documents"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowUploadModal(false)
                            setUploadedFiles([])
                          }}
                          className="p-2 hover:bg-[#f8f7f5] rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-[#6b675f]" />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                        {/* Drag and Drop Area */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragging
                              ? 'border-[#3d3d3d] bg-[#f8f7f5]'
                              : 'border-[#d0d0d0] hover:border-[#6b675f]'
                          }`}
                        >
                          <Upload className="w-12 h-12 text-[#d0d0d0] mx-auto mb-4" />
                          <p className="text-sm font-medium text-[#3d3d3d] mb-2">
                            Drag and drop files here
                          </p>
                          <p className="text-xs text-[#6b675f] mb-4">or</p>
                          <label className="inline-block">
                            <input
                              type="file"
                              multiple
                              onChange={handleFileSelect}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx"
                            />
                            <span className="px-4 py-2 bg-white border border-[#d0d0d0] text-[#3d3d3d] text-sm rounded-md hover:bg-[#f8f7f5] cursor-pointer inline-flex items-center gap-2 transition-colors">
                              <File className="w-4 h-4" />
                              Browse Files
                            </span>
                          </label>
                          <p className="text-xs text-[#6b675f] mt-4">
                            Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, XLS, XLSX
                          </p>
                          <p className="text-xs text-[#6b675f] mt-2 italic">
                            Tip: For multi-page documents, select all pages at once or use "Add Files" below to add pages individually
                          </p>
                        </div>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold text-[#3d3d3d]">
                                Selected Files ({uploadedFiles.length})
                              </h3>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleFileSelect}
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx"
                                />
                                <span className="px-3 py-1.5 bg-white border border-[#d0d0d0] text-[#3d3d3d] text-xs rounded hover:bg-[#f8f7f5] inline-flex items-center gap-1.5 transition-colors">
                                  <Plus className="w-3.5 h-3.5" />
                                  Add Files
                                </span>
                              </label>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-[#f8f7f5] rounded-lg border border-[#e5e5e5] group hover:border-[#d0d0d0] transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <File className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-[#3d3d3d] truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-[#6b675f]">
                                        {formatFileSize(file.size)}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="p-1.5 text-[#6b675f] hover:bg-white hover:text-red-600 rounded transition-colors flex-shrink-0"
                                    title="Remove file"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 py-4 border-t border-[#e5e5e5] bg-[#fafafa] gap-3">
                        <p className="text-xs text-[#6b675f] text-center sm:text-left">
                          {uploadedFiles.length > 0
                            ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} ready to upload`
                            : 'No files selected'}
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => {
                              setShowUploadModal(false)
                              setUploadedFiles([])
                            }}
                            className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9 flex-1 sm:flex-initial"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUploadComplete}
                            disabled={uploadedFiles.length === 0}
                            className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Move File Modal */}
                {showMoveModal && fileToMove && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
                        <h2 className="text-lg font-semibold text-[#3d3d3d]">Move File</h2>
                        <button
                          onClick={() => {
                            setShowMoveModal(false)
                            setFileToMove(null)
                          }}
                          className="p-2 hover:bg-[#f8f7f5] rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-[#6b675f]" />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="px-6 py-6">
                        <p className="text-sm text-[#6b675f] mb-4">
                          Move <span className="font-medium text-[#3d3d3d]">{fileToMove}</span> to:
                        </p>
                        
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {/* Show all folders except current one */}
                          {Object.keys(folders)
                            .filter(key => key !== "root" && key !== currentFolder)
                            .map((folderKey) => {
                              const folderList = folders[folderKey as keyof typeof folders];
                              if (Array.isArray(folderList) && folderList.length > 0) {
                                return folderList.map((folder) => (
                                  <button
                                    key={folder.name}
                                    onClick={() => handleMoveFile(fileToMove, folder.name)}
                                    className="w-full flex items-center gap-3 p-3 border border-[#e5e5e5] rounded-lg hover:border-[#3d3d3d] hover:bg-[#fafafa] transition-colors text-left"
                                  >
                                    <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                                    <span className="text-sm text-[#3d3d3d]">{folder.name}</span>
                                  </button>
                                ));
                              }
                              return null;
                            })}
                          
                          {/* Show root level folders */}
                          {folders.root.filter(f => f.name !== currentFolder).map((folder) => (
                            <button
                              key={folder.name}
                              onClick={() => handleMoveFile(fileToMove, folder.name)}
                              className="w-full flex items-center gap-3 p-3 border border-[#e5e5e5] rounded-lg hover:border-[#3d3d3d] hover:bg-[#fafafa] transition-colors text-left"
                            >
                              <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                              <span className="text-sm text-[#3d3d3d]">{folder.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-end px-6 py-4 border-t border-[#e5e5e5] bg-[#fafafa]">
                        <Button
                          onClick={() => {
                            setShowMoveModal(false)
                            setFileToMove(null)
                          }}
                          className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Modal */}
                {showPreviewModal && previewFile && (
                  <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-2 sm:p-4"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowPreviewModal(false)
                        setPreviewFile(null)
                      }
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e5e5e5]">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          {getFileIcon(previewFile.type)}
                          <h2 className="text-sm sm:text-lg font-semibold text-[#3d3d3d] truncate">{previewFile.name}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadFile(previewFile.name)}
                            className="p-2 hover:bg-[#f8f7f5] rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5 text-[#6b675f]" />
                          </button>
                          <button
                            onClick={() => {
                              setShowPreviewModal(false)
                              setPreviewFile(null)
                            }}
                            className="p-2 hover:bg-[#f8f7f5] rounded-full transition-colors"
                          >
                            <X className="w-5 h-5 text-[#6b675f]" />
                          </button>
                        </div>
                      </div>

                      {/* Modal Body */}
                      <div className="flex-1 overflow-hidden p-6 bg-[#fafafa]">
                        <div className="h-full flex items-center justify-center">
                          {previewFile.type.startsWith('image/') ? (
                            <div className="max-w-full max-h-full flex items-center justify-center">
                              <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img
                                  src={`https://via.placeholder.com/800x600/e5e5e5/6b675f?text=${encodeURIComponent(previewFile.name)}`}
                                  alt={previewFile.name}
                                  className="max-w-full max-h-[70vh] object-contain rounded"
                                />
                              </div>
                            </div>
                          ) : previewFile.type === 'application/pdf' ? (
                            <div className="w-full h-full bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="w-24 h-24 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-[#3d3d3d] mb-2">PDF Document</h3>
                                <p className="text-sm text-[#6b675f] mb-4">{previewFile.name}</p>
                                <p className="text-xs text-[#6b675f] mb-6">
                                  PDF preview will be available when integrated with a document viewer
                                </p>
                                <Button
                                  onClick={() => handleDownloadFile(previewFile.name)}
                                  className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9"
                                >
                                  <Download className="w-4 h-4 mr-1.5" />
                                  Download to View
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <File className="w-24 h-24 text-[#d0d0d0] mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-[#3d3d3d] mb-2">Preview Not Available</h3>
                              <p className="text-sm text-[#6b675f] mb-4">{previewFile.name}</p>
                              <Button
                                onClick={() => handleDownloadFile(previewFile.name)}
                                className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9"
                              >
                                <Download className="w-4 h-4 mr-1.5" />
                                Download File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5e5] bg-white">
                        <p className="text-xs text-[#6b675f]">
                          Press ESC to close
                        </p>
                        <Button
                          onClick={() => {
                            setShowPreviewModal(false)
                            setPreviewFile(null)
                          }}
                          className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents List */}
                <div className="flex-1 overflow-auto">
                  {(() => {
                    const currentFolders = currentFolder 
                      ? folders[currentFolder as keyof typeof folders] || []
                      : folders.root;
                    
                    const currentFiles = currentFolder ? files[currentFolder] || [] : [];
                    
                    const isEmpty = currentFolders.length === 0 && currentFiles.length === 0;

                    if (isEmpty) {
                      // Empty State with Animation
                      return (
                        <div className="flex items-center justify-center h-full animate-fadeIn">
                          <div className="text-center max-w-md px-6 py-12">
                            <div className="mb-6 relative inline-block">
                              {/* Folder icon */}
                              <div className="relative">
                                <FolderOpen className="w-24 h-24 text-[#d0d0d0]" />
                                {/* Upload icon */}
                                <div className="absolute -top-2 -right-2">
                                  <div className="bg-white rounded-full p-2 shadow-lg">
                                    <Upload className="w-6 h-6 text-[#6b675f]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-[#3d3d3d] mb-2">
                              {currentFolder ? `No documents in ${currentFolder}` : "No folders yet"}
                            </h3>
                            
                            <p className="text-[13px] text-[#6b675f] mb-6 leading-relaxed">
                              {currentFolder 
                                ? "This folder is empty. Start organizing your documents by uploading files or creating subfolders."
                                : "Create your first folder to start organizing estate documents."}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <Button 
                                onClick={() => setShowUploadModal(true)}
                                className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-10"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Documents
                              </Button>
                              <Button className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-10">
                                <FolderPlus className="w-4 h-4 mr-2" />
                                Create Subfolder
                              </Button>
                            </div>
                            
                            {/* Helpful tips */}
                            <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
                              <p className="text-xs text-[#6b675f] mb-3 font-medium">Quick Tips:</p>
                              <ul className="text-xs text-[#6b675f] space-y-2 text-left">
                                <li className="flex items-start gap-2">
                                  <span className="text-[#3d3d3d] mt-0.5">•</span>
                                  <span>Organize documents by type for easy access</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#3d3d3d] mt-0.5">•</span>
                                  <span>Use clear, descriptive names for folders</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#3d3d3d] mt-0.5">•</span>
                                  <span>Accepted formats: PDF, DOC, DOCX, JPG, PNG</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Regular folder/file list
                    return (
                      <div className="bg-white m-4 sm:m-6 rounded-lg border border-[#e5e5e5] overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-[#f8f7f5] border-b border-[#e5e5e5]">
                            <tr>
                              <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Name</th>
                              <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Size</th>
                              <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Modified</th>
                              <th className="text-right px-6 py-3 text-[#3d3d3d] font-semibold text-sm w-48">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Folders */}
                            {currentFolders.map((folder, index) => (
                              <tr 
                                key={`folder-${index}`} 
                                className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors group"
                                onMouseEnter={() => setHoveredFolder(folder.name)}
                                onMouseLeave={() => setHoveredFolder(null)}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                                    {editingFolder === folder.name ? (
                                      <input
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        onBlur={() => handleRenameFolder(folder.name, editingValue)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleRenameFolder(folder.name, editingValue)
                                          } else if (e.key === 'Escape') {
                                            setEditingFolder(null)
                                          }
                                        }}
                                        autoFocus
                                        className="flex-1 px-2 py-1 text-sm border border-[#3d3d3d] rounded focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
                                      />
                                    ) : (
                                      <span 
                                        className="text-[#3d3d3d] text-sm cursor-pointer font-medium"
                                        onClick={() => {
                                          setCurrentFolder(folder.name);
                                        }}
                                      >
                                        {folder.name}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-[#6b675f] text-sm">—</td>
                                <td className="px-6 py-4 text-[#6b675f] text-sm">{folder.modified}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-1">
                                    {deleteConfirm === folder.name ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#6b675f]">Delete?</span>
                                        <button
                                          onClick={() => handleDeleteFolder(folder.name)}
                                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() => setDeleteConfirm(null)}
                                          className="px-2 py-1 bg-[#e5e5e5] text-[#3d3d3d] text-xs rounded hover:bg-[#d0d0d0] transition-colors"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => {
                                            setEditingFolder(folder.name)
                                            setEditingValue(folder.name)
                                          }}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#e5e5e5] rounded transition-colors"
                                          title="Rename folder"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setDeleteConfirm(folder.name)}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#fee] hover:text-red-600 rounded transition-colors"
                                          title="Delete folder"
                                        >
                                          <Trash className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            
                            {/* Files */}
                            {currentFiles.map((file, index) => (
                              <tr 
                                key={`file-${index}`} 
                                className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors group"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    {getFileIcon(file.type)}
                                    {editingFile === file.name ? (
                                      <input
                                        type="text"
                                        value={editingFileValue}
                                        onChange={(e) => setEditingFileValue(e.target.value)}
                                        onBlur={() => handleRenameFile(file.name, editingFileValue)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleRenameFile(file.name, editingFileValue)
                                          } else if (e.key === 'Escape') {
                                            setEditingFile(null)
                                          }
                                        }}
                                        autoFocus
                                        className="flex-1 px-2 py-1 text-sm border border-[#3d3d3d] rounded focus:outline-none focus:ring-2 focus:ring-[#3d3d3d]"
                                      />
                                    ) : (
                                      <span className="text-[#3d3d3d] text-sm">{file.name}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-[#6b675f] text-sm">{file.size}</td>
                                <td className="px-6 py-4 text-[#6b675f] text-sm">{file.modified}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-1">
                                    {deleteFileConfirm === file.name ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#6b675f]">Delete?</span>
                                        <button
                                          onClick={() => handleDeleteFile(file.name)}
                                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() => setDeleteFileConfirm(null)}
                                          className="px-2 py-1 bg-[#e5e5e5] text-[#3d3d3d] text-xs rounded hover:bg-[#d0d0d0] transition-colors"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handlePreviewFile(file.name, file.type)}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#e5e5e5] rounded transition-colors"
                                          title="Preview file"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDownloadFile(file.name)}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#e5e5e5] rounded transition-colors"
                                          title="Download file"
                                        >
                                          <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingFile(file.name)
                                            setEditingFileValue(file.name)
                                          }}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#e5e5e5] rounded transition-colors"
                                          title="Rename file"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setFileToMove(file.name)
                                            setShowMoveModal(true)
                                          }}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#e5e5e5] rounded transition-colors"
                                          title="Move to folder"
                                        >
                                          <FolderInput className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setDeleteFileConfirm(file.name)}
                                          className="p-1.5 text-[#6b675f] hover:bg-[#fee] hover:text-red-600 rounded transition-colors"
                                          title="Delete file"
                                        >
                                          <Trash className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </>
            ) : activeNav === "timeline" ? (
              // Estate Timeline View
              <>
                {/* Timeline Header */}
                <div className="bg-white border-b border-[#d4cfca] px-4 sm:px-6 py-4">
                  <h2 className="text-base sm:text-lg font-semibold text-[#2d2d2d] mb-4">Estate Timeline</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <Button
                      onClick={() => setShowAddMilestoneModal(true)}
                      className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9 flex-1 sm:flex-initial"
                    >
                      <Plus className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Add Milestone</span>
                    </Button>
                    <Button
                      onClick={() => { setShowAddDeadlineModal(true); setDeadlineModalStep(1); setDeadlineModalTrigger(null); setDeadlineModalChecked([]) }}
                      className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9 flex-1 sm:flex-initial"
                    >
                      <Plus className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Add Deadline</span>
                    </Button>
                  </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6">
                  <div className="max-w-4xl mx-auto">

                    {/* Urgent Deadlines Callout — only shown when deadlines need attention */}
                    {(() => {
                      const urgent = deadlines.filter(d => {
                        if (d.completed) return false
                        const today = new Date(); today.setHours(0,0,0,0)
                        const diff = Math.ceil((new Date(d.dueDate).getTime() - today.getTime()) / 86400000)
                        return diff <= 7
                      })
                      if (urgent.length === 0) return null
                      return (
                        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 overflow-hidden">
                          <div className="flex items-center gap-2 px-4 py-3 border-b border-red-200">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-red-700">
                              {urgent.length} deadline{urgent.length > 1 ? "s" : ""} need{urgent.length === 1 ? "s" : ""} attention
                            </span>
                          </div>
                          <div className="divide-y divide-red-100">
                            {urgent.map(deadline => {
                              const urgency = getDeadlineUrgency(deadline.dueDate, deadline.completed)
                              let formattedDate = deadline.dueDate
                              try { formattedDate = format(new Date(deadline.dueDate), "MMM d, yyyy") } catch {}
                              return (
                                <div key={deadline.id} className="flex items-center gap-3 px-4 py-2.5">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium flex-shrink-0 ${urgency.color}`}>
                                    {urgency.label}
                                  </span>
                                  <span className="text-sm font-medium text-[#3d3d3d] flex-1 min-w-0 truncate">{deadline.title}</span>
                                  <span className="text-xs text-[#6b675f] flex-shrink-0">{formattedDate}</span>
                                  <input
                                    type="checkbox"
                                    checked={deadline.completed}
                                    onChange={() => handleToggleDeadlineComplete(deadline.id)}
                                    className="w-4 h-4 flex-shrink-0 cursor-pointer accent-[#3d3d3d]"
                                    title="Mark complete"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}

                    {/* Milestones Section */}
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9b9b9b] mb-4">Milestones</p>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#d4cfca]"></div>
                      {milestones.length === 0 ? (
                        <p className="pl-16 pb-8 text-sm text-[#9b9b9b]">No milestones yet.</p>
                      ) : milestones.map((milestone) => (
                        <div key={milestone.id} className="relative pl-16 pb-8">
                          <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-[#3d3d3d] border-4 border-white shadow-sm"></div>
                          <div className="bg-white rounded-lg border border-[#e5e5e5] p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-base font-semibold text-[#3d3d3d] mb-2">{milestone.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-[#6b675f] mb-2">
                              <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4" />
                                <span>{milestone.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{milestone.assignedTo}</span>
                              </div>
                            </div>
                            <p className="text-sm text-[#6b675f]">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* All Deadlines Section */}
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9b9b9b] mt-8 mb-4">All Deadlines</p>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#d4cfca]"></div>
                      {deadlines.length === 0 ? (
                        <p className="pl-16 pb-8 text-sm text-[#9b9b9b]">No deadlines yet.</p>
                      ) : deadlines.map((deadline) => {
                        const urgency = getDeadlineUrgency(deadline.dueDate, deadline.completed)
                        let formattedDate = deadline.dueDate
                        try { formattedDate = format(new Date(deadline.dueDate), "MMM d, yyyy") } catch {}
                        const dotColor = deadline.completed
                          ? "bg-green-500"
                          : urgency.color.includes("red") ? "bg-red-500"
                          : urgency.color.includes("orange") ? "bg-orange-400"
                          : urgency.color.includes("amber") ? "bg-amber-400"
                          : urgency.color.includes("blue") ? "bg-blue-400"
                          : "bg-[#9b9b9b]"
                        return (
                          <div key={deadline.id} className="relative pl-16 pb-8">
                            <div className={`absolute left-4 top-2 w-5 h-5 rounded-full ${dotColor} border-4 border-white shadow-sm`}></div>
                            <div className={`bg-white rounded-lg border border-[#e5e5e5] p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow ${deadline.completed ? "opacity-60" : ""}`}>
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className={`text-base font-semibold text-[#3d3d3d] ${deadline.completed ? "line-through" : ""}`}>
                                  {deadline.title}
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${urgency.color}`}>
                                    {urgency.label}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={deadline.completed}
                                    onChange={() => handleToggleDeadlineComplete(deadline.id)}
                                    className="w-4 h-4 rounded border-[#d0d0d0] cursor-pointer accent-[#3d3d3d]"
                                    title="Mark complete"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-[#6b675f] mb-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <CalendarDays className="w-4 h-4" />
                                  <span>{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <User className="w-4 h-4" />
                                  <span>{deadline.assignedTo}</span>
                                </div>
                                {deadline.trigger && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#ebe9e6] text-[#6b675f]">
                                    Trigger: {deadline.trigger}
                                  </span>
                                )}
                                {deadline.window && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#ebe9e6] text-[#6b675f]">
                                    {deadline.window}
                                  </span>
                                )}
                                {deadline.authority && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#ebe9e6] text-[#6b675f]">
                                    {deadline.authority}
                                  </span>
                                )}
                              </div>
                              {deadline.description && (
                                <p className="text-sm text-[#6b675f]">{deadline.description}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                  </div>
                </div>
              </>
            ) : (
              // Original Assets/Other Views
              <>
                {/* Estate Info Header */}
                <div className="bg-white border-b border-[#e5e5e5] px-6 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-[#6b675f]">ID: {selectedEstate.id}</span>
                        <button className="text-[#6b675f] hover:text-[#3d3d3d]">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-[#6b675f] hover:text-[#3d3d3d]">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h2 className="text-lg font-semibold text-[#3d3d3d] mb-1.5">Estate of: {selectedEstate.name}</h2>
                      <div className="flex items-center gap-4 text-sm">
                        {selectedEstate.scanBoxId && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#6b675f]">Scan Box ID:</span>
                            <span className="text-[#3d3d3d]">{selectedEstate.scanBoxId}</span>
                            <button className="text-[#6b675f] hover:text-[#3d3d3d]">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        {selectedEstate.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#3d3d3d]">{selectedEstate.email}</span>
                            <button className="text-[#6b675f] hover:text-[#3d3d3d]">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Button className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create New Contact
                      </Button>
                      <p className="text-xs text-[#6b675f] mt-1.5">This estate doesn't have any contacts yet.</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border-b border-[#e5e5e5] px-6">
                  <div className="flex gap-6">
                    {["Assets", "Debts", "Obligations", "Expenses", "Timeline", "Contacts"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-1 py-3 text-[13px] border-b-2 transition-colors ${
                          activeTab === tab.toLowerCase()
                            ? "border-[#3d3d3d] text-[#3d3d3d] font-medium"
                            : "border-transparent text-[#6b675f] hover:text-[#3d3d3d]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Tab Content */}
                {activeTab === "timeline" ? (
                  <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-5xl mx-auto">
                      {/* Header with Add Milestone button */}
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-[#3d3d3d]">Milestones Overview</h2>
                        <Button 
                          onClick={() => setShowAddMilestoneModal(true)}
                          className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9"
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Add Milestone
                        </Button>
                      </div>
                      
                      {/* Milestones Table */}
                      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[#ebe9e6]">
                            <tr>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Milestone</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Date</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Assigned To</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {milestones.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-[#6b675f] text-sm">
                                  No milestones yet. Click "Add Milestone" to create one.
                                </td>
                              </tr>
                            ) : (
                              milestones.map((milestone) => (
                                <tr key={milestone.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                                  <td className="px-4 py-3 text-[#3d3d3d] text-[13px] font-medium">{milestone.name}</td>
                                  <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{milestone.date}</td>
                                  <td className="px-4 py-3 text-[#6b675f] text-[13px]">{milestone.assignedTo}</td>
                                  <td className="px-4 py-3 text-[#6b675f] text-[13px]">{milestone.description}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Deadlines Section */}
                      <div className="flex items-center justify-between mt-10 mb-6">
                        <h2 className="text-lg font-semibold text-[#3d3d3d]">Deadlines</h2>
                        <Button
                          onClick={() => { setShowAddDeadlineModal(true); setDeadlineModalStep(1); setDeadlineModalTrigger(null); setDeadlineModalChecked([]) }}
                          className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9"
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Add Deadline
                        </Button>
                      </div>

                      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#ebe9e6]">
                            <tr>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Title</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Trigger</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Window</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Due Date</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Status</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Assigned To</th>
                              <th className="text-left px-4 py-3 text-[#3d3d3d] font-medium text-[13px]">Done</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deadlines.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-[#6b675f] text-sm">
                                  No deadlines yet. Click "Add Deadline" to create one.
                                </td>
                              </tr>
                            ) : (
                              deadlines.map((deadline) => {
                                const urgency = getDeadlineUrgency(deadline.dueDate, deadline.completed)
                                let formattedDate = deadline.dueDate
                                try { formattedDate = format(new Date(deadline.dueDate), "MMM d, yyyy") } catch {}
                                return (
                                  <tr key={deadline.id} className={`border-t border-[#f0f0f0] hover:bg-[#fafafa] ${deadline.completed ? "opacity-50" : ""}`}>
                                    <td className={`px-4 py-3 text-[13px] font-medium text-[#3d3d3d] max-w-[200px] ${deadline.completed ? "line-through" : ""}`}>{deadline.title}</td>
                                    <td className="px-4 py-3 text-[#6b675f] text-[13px] whitespace-nowrap">{deadline.trigger || "—"}</td>
                                    <td className="px-4 py-3 text-[#6b675f] text-[13px] whitespace-nowrap">{deadline.window || "—"}</td>
                                    <td className="px-4 py-3 text-[#3d3d3d] text-[13px] whitespace-nowrap">{formattedDate}</td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${urgency.color}`}>
                                        {urgency.label}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-[#6b675f] text-[13px]">{deadline.assignedTo}</td>
                                    <td className="px-4 py-3">
                                      <input
                                        type="checkbox"
                                        checked={deadline.completed}
                                        onChange={() => handleToggleDeadlineComplete(deadline.id)}
                                        className="w-4 h-4 rounded border-[#d0d0d0] cursor-pointer accent-[#3d3d3d]"
                                      />
                                    </td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Filters */}
                    <div className="bg-white border-b border-[#e5e5e5] px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                          <Input
                            type="text"
                            placeholder="Search"
                            className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#9b9b9b]"
                          />
                        </div>
                        <select className="h-9 px-3 py-1.5 bg-white border border-[#d0d0d0] rounded-md text-[#6b675f] text-sm">
                          <option>Status</option>
                        </select>
                        <select className="h-9 px-3 py-1.5 bg-white border border-[#d0d0d0] rounded-md text-[#6b675f] text-[13px]">
                          <option>Type</option>
                        </select>
                        <Button className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] ml-auto text-sm h-9">
                          <Plus className="w-4 h-4 mr-1.5" />
                          Add New Asset
                        </Button>
                      </div>
                    </div>

                    {/* Real Estate Section */}
                    <div className="flex-1 overflow-auto p-6">
                  <h3 className="text-base font-semibold text-[#3d3d3d] mb-3">Real Estate</h3>
                  <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#ebe9e6]">
                        <tr>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Description</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Type</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Address</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">City</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">State</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Value</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Status</th>
                          <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEstate.assets && selectedEstate.assets.length > 0 ? (
                          selectedEstate.assets.map((asset: any, index: number) => (
                            <tr key={index} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]"></td>
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{asset.type}</td>
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{asset.address}</td>
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{asset.city}</td>
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{asset.state}</td>
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{asset.value}</td>
                              <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{asset.status}</td>
                              <td className="px-4 py-3">
                                <button className="text-[#6b675f] hover:text-[#3d3d3d]">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-[#6b675f] text-[13px]">
                              No real estate assets found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                  </>
                )}
              </>
            )}
          </main>

          {/* Right Side Agent Text */}
          <div className="flex items-center justify-center bg-[#2d2d2d] px-2">
            <div className="writing-mode-vertical-rl rotate-180 text-white font-semibold tracking-widest text-sm">
              AI AGENT
            </div>
          </div>
        </div>

        {/* Add Milestone Modal */}
        {showAddMilestoneModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
                <h2 className="text-lg font-semibold text-[#3d3d3d]">Add Milestone</h2>
                <button
                  onClick={() => {
                    setShowAddMilestoneModal(false)
                    setNewMilestoneName("")
                    setNewMilestoneDate("")
                    setNewMilestoneDescription("")
                    setNewMilestoneAssignedTo("")
                  }}
                  className="p-2 hover:bg-[#f8f7f5] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#6b675f]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    className="w-full h-9 px-3 py-1.5 text-sm bg-white border border-[#d0d0d0] rounded-md text-[#3d3d3d] focus:outline-none focus:ring-2 focus:ring-[#3d3d3d] focus:border-transparent"
                  >
                    <option value="">Select a milestone...</option>
                    <option value="Closed WON">Closed WON</option>
                    <option value="K.Y.C.">K.Y.C.</option>
                    <option value="Determine Legal Path">Determine Legal Path</option>
                    <option value="File for Authority">File for Authority</option>
                    <option value="Initial Court Date">Initial Court Date</option>
                    <option value="Authority Granted">Authority Granted</option>
                    <option value="Establish Operating Bank Account">Establish Operating Bank Account</option>
                    <option value="File Distribution Order">File Distribution Order</option>
                    <option value="File Tax Return">File Tax Return</option>
                    <option value="File To Close">File To Close</option>
                    <option value="Estate Closed">Estate Closed</option>
                  </select>
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d]"
                  />
                </div>

                {/* Assigned To Field */}
                <div>
                  <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                    Assigned To
                  </label>
                  <Input
                    type="text"
                    value={newMilestoneAssignedTo}
                    onChange={(e) => setNewMilestoneAssignedTo(e.target.value)}
                    placeholder="e.g., John Smith"
                    className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#9b9b9b]"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={newMilestoneDescription}
                    onChange={(e) => setNewMilestoneDescription(e.target.value)}
                    placeholder="Enter milestone details..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d0d0d0] rounded-md text-[#3d3d3d] placeholder:text-[#9b9b9b] focus:outline-none focus:ring-2 focus:ring-[#3d3d3d] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e5e5] bg-[#fafafa]">
                <Button
                  onClick={() => {
                    setShowAddMilestoneModal(false)
                    setNewMilestoneName("")
                    setNewMilestoneDate("")
                    setNewMilestoneDescription("")
                    setNewMilestoneAssignedTo("")
                  }}
                  className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMilestone}
                  className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9"
                >
                  Save Milestone
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Deadline Modal */}
        {showAddDeadlineModal && (() => {
          const selectedCategory = deadlineModalTrigger && deadlineModalTrigger !== "custom"
            ? DEADLINE_CATEGORIES.find(c => c.key === deadlineModalTrigger)
            : null

          const milestoneRawDate = selectedCategory ? getMilestoneDate(selectedCategory.triggerKeyword) : ""
          let milestoneDateDisplay = milestoneRawDate
          try {
            if (milestoneRawDate) {
              const d = new Date(milestoneRawDate)
              if (!isNaN(d.getTime())) milestoneDateDisplay = format(d, "MMM d, yyyy")
            }
          } catch {}

          const checkedCount = deadlineModalChecked.length

          return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={resetDeadlineModal}>
              <div
                className="bg-white w-full max-w-[520px] border border-[#d0d0d0] rounded-sm max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e5e5e5] flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {deadlineModalStep === 2 && (
                      <button
                        onClick={() => { setDeadlineModalStep(1); setDeadlineModalTrigger(null); setDeadlineModalChecked([]); setDeadlineModalWindowOverrides({}) }}
                        className="text-[#6b675f] hover:text-[#3d3d3d] transition-colors mr-1"
                        aria-label="Back"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                    )}
                    <span className="text-[13px] font-semibold text-[#3d3d3d] tracking-tight">Add deadline</span>
                    {deadlineModalStep === 2 && selectedCategory && (
                      <span className="text-[11px] text-[#9b9b9b] font-normal ml-1">{selectedCategory.label}</span>
                    )}
                  </div>
                  <button onClick={resetDeadlineModal} className="p-1 hover:bg-[#f0f0f0] rounded transition-colors" aria-label="Close">
                    <X className="w-4 h-4 text-[#9b9b9b]" />
                  </button>
                </div>

                {/* Step 1 — Category selection */}
                {deadlineModalStep === 1 && (
                  <div className="px-5 py-5 overflow-y-auto">
                    <p className="text-[12px] text-[#9b9b9b] mb-4 leading-relaxed">What type of deadlines do you need to add?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DEADLINE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => {
                            setDeadlineModalTrigger(cat.key)
                            setDeadlineModalStep(2)
                            setDeadlineModalChecked(cat.items.map(i => i.title))
                          }}
                          className="text-left p-3.5 border border-[#e0e0e0] rounded-sm hover:border-[#3d3d3d] hover:bg-[#fafafa] transition-colors group"
                        >
                          <p className="text-[12px] font-semibold text-[#3d3d3d] mb-0.5 leading-snug group-hover:text-[#1a1a1a]">{cat.label}</p>
                          <p className="text-[10px] text-[#b0b0b0] mb-2 leading-snug">{cat.subtitle}</p>
                          <ul className="space-y-0.5">
                            {cat.preview.map((item) => (
                              <li key={item} className="text-[11px] text-[#9b9b9b] leading-snug">{item}</li>
                            ))}
                          </ul>
                        </button>
                      ))}
                      <button
                        onClick={() => { setDeadlineModalTrigger("custom"); setDeadlineModalStep(2) }}
                        className="text-left p-3.5 border border-dashed border-[#e0e0e0] rounded-sm hover:border-[#3d3d3d] hover:bg-[#fafafa] transition-colors group"
                      >
                        <p className="text-[12px] font-semibold text-[#3d3d3d] mb-0.5 leading-snug group-hover:text-[#1a1a1a]">Custom deadline</p>
                        <p className="text-[10px] text-[#b0b0b0] mb-2 leading-snug">Any date or event</p>
                        <p className="text-[11px] text-[#9b9b9b] leading-snug">Set your own title, due date, and notes</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 — Custom form */}
                {deadlineModalStep === 2 && deadlineModalTrigger === "custom" && (
                  <div className="px-5 py-5 space-y-4 overflow-y-auto">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9b9b9b] uppercase tracking-wider mb-1.5">Title</label>
                      <Input
                        type="text"
                        value={newDeadlineTitle}
                        onChange={(e) => setNewDeadlineTitle(e.target.value)}
                        placeholder="Deadline name"
                        className="h-8 text-[13px] bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#c0c0c0] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9b9b9b] uppercase tracking-wider mb-1.5">Due date</label>
                      <Input
                        type="date"
                        value={newDeadlineDueDate}
                        onChange={(e) => setNewDeadlineDueDate(e.target.value)}
                        className="h-8 text-[13px] bg-white border-[#d0d0d0] text-[#3d3d3d] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9b9b9b] uppercase tracking-wider mb-1.5">Assigned to</label>
                      <Input
                        type="text"
                        value={newDeadlineAssignedTo}
                        onChange={(e) => setNewDeadlineAssignedTo(e.target.value)}
                        placeholder="e.g., Clayton Noyes"
                        className="h-8 text-[13px] bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#c0c0c0] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9b9b9b] uppercase tracking-wider mb-1.5">Notes</label>
                      <textarea
                        value={newDeadlineDescription}
                        onChange={(e) => setNewDeadlineDescription(e.target.value)}
                        placeholder="Optional notes"
                        rows={3}
                        className="w-full px-3 py-2 text-[13px] bg-white border border-[#d0d0d0] rounded-sm text-[#3d3d3d] placeholder:text-[#c0c0c0] focus:outline-none focus:ring-1 focus:ring-[#3d3d3d] focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#f0f0f0]">
                      <Button onClick={resetDeadlineModal} className="h-8 px-4 bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-[12px] rounded-sm font-medium">Cancel</Button>
                      <Button onClick={handleAddDeadline} className="h-8 px-4 bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-[12px] rounded-sm font-medium">Add deadline</Button>
                    </div>
                  </div>
                )}

                {/* Step 2 — Category checklist with editable windows */}
                {deadlineModalStep === 2 && deadlineModalTrigger !== "custom" && selectedCategory && (
                  <div className="flex flex-col min-h-0">
                    <div className="px-5 pt-4 overflow-y-auto flex-1">
                      {/* Trigger date pill */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f0f0] border border-[#e0e0e0] rounded-full mb-4">
                        <span className="text-[11px] font-medium text-[#3d3d3d]">
                          {selectedCategory.triggerLabel}{milestoneDateDisplay ? ` · ${milestoneDateDisplay}` : " · date not set"}
                        </span>
                      </div>

                      {/* Checklist */}
                      <div className="divide-y divide-[#f0f0f0] border border-[#e5e5e5] rounded-sm overflow-hidden mb-4">
                        {selectedCategory.items.map((item) => {
                          const checked = deadlineModalChecked.includes(item.title)
                          const currentValue = deadlineModalWindowOverrides[item.title] ?? item.defaultValue
                          const windowStr = `${currentValue} ${item.unit}`
                          const calcDate = milestoneRawDate ? calcDueDate(milestoneRawDate, windowStr) : ""
                          let calcDateDisplay = ""
                          try { if (calcDate) calcDateDisplay = format(new Date(calcDate + "T00:00:00"), "MMM d, yyyy") } catch {}
                          const isDefault = currentValue === item.defaultValue
                          return (
                            <div key={item.title} className={`px-3.5 py-3 transition-colors ${checked ? "hover:bg-[#fafafa]" : "bg-[#fafafa]"}`}>
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    setDeadlineModalChecked(prev =>
                                      checked ? prev.filter(t => t !== item.title) : [...prev, item.title]
                                    )
                                  }}
                                  className="mt-0.5 w-3.5 h-3.5 rounded-none border-[#c0c0c0] accent-[#3d3d3d] cursor-pointer flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className={`text-[12px] font-medium leading-snug mb-1.5 ${checked ? "text-[#3d3d3d]" : "line-through text-[#c0c0c0]"}`}>
                                    {item.title}
                                  </p>
                                  {checked && (
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min={1}
                                          value={currentValue}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value)
                                            if (!isNaN(val) && val > 0) {
                                              setDeadlineModalWindowOverrides(prev => ({ ...prev, [item.title]: val }))
                                            }
                                          }}
                                          className="w-12 h-6 px-1.5 text-[11px] border border-[#d0d0d0] rounded-sm text-center text-[#3d3d3d] focus:outline-none focus:ring-1 focus:ring-[#3d3d3d]"
                                        />
                                        <span className="text-[11px] text-[#6b675f]">{item.unit}</span>
                                        {!isDefault && (
                                          <button
                                            onClick={() => setDeadlineModalWindowOverrides(prev => { const n = { ...prev }; delete n[item.title]; return n })}
                                            className="text-[10px] text-[#9b9b9b] hover:text-[#3d3d3d] underline ml-0.5"
                                          >
                                            reset
                                          </button>
                                        )}
                                      </div>
                                      {calcDateDisplay && (
                                        <span className="text-[11px] text-[#9b9b9b]">→ {calcDateDisplay}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[#f0f0f0] flex-shrink-0">
                      <Button onClick={resetDeadlineModal} className="h-8 px-4 bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-[12px] rounded-sm font-medium">Cancel</Button>
                      <Button
                        onClick={handleAddDeadline}
                        disabled={checkedCount === 0}
                        className="h-8 px-4 bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-[12px] rounded-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Add {checkedCount > 0 ? checkedCount : ""} deadline{checkedCount !== 1 ? "s" : ""}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    )
  }

  // Estates List View
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Dark Header Bar */}
      <header className="bg-[#3d3d3d] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1 hover:bg-[#4d4d4d] rounded transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm sm:text-base font-semibold">Estates</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs text-gray-400 hidden md:inline">release/2025-12-30#2 | 44fecdd</span>
          <button className="p-1 hover:bg-[#4d4d4d] rounded transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-[#4d4d4d] rounded transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-64 bg-[#d8d4ce] flex flex-col border-r border-[#c0bcb6] transition-transform duration-300 h-full`}>
          <nav className="flex-1 p-2 space-y-0.5">
            <button
              onClick={() => { setActiveNav("home"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "home" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="Home"
            >
              <Home className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">Home</span>
            </button>
            <button
              onClick={() => { setActiveNav("jobs"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "jobs" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="My Jobs"
            >
              <Briefcase className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">My Jobs</span>
            </button>
            <button
              onClick={() => { setActiveNav("add"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "add" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="Add Estate"
            >
              <FileText className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">Add Estate</span>
            </button>
            <button
              onClick={() => { setActiveNav("deleted"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "deleted" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="Manage Deleted Estates"
            >
              <Trash2 className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">Manage Deleted Estates</span>
            </button>
            <button
              onClick={() => { setActiveNav("users"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "users" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="Manage Care Team Users"
            >
              <Users className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">Manage Care Team Users</span>
            </button>
            <button
              onClick={() => { setActiveNav("institutions"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "institutions" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="Manage Institutions"
            >
              <Building2 className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">Manage Institutions</span>
            </button>
            <button
              onClick={() => { setActiveNav("document-vault"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors ${
                activeNav === "document-vault" 
                  ? "bg-[#ececec] text-[#3d3d3d]" 
                  : "text-[#6b675f] hover:bg-[#ececec] hover:text-[#3d3d3d]"
              }`}
              title="Document Vault"
            >
              <FolderOpen className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] whitespace-nowrap">Document Vault</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8f7f5]">
          {activeNav === "document-vault" ? (
            // Document Vault View
            <>
              {/* Vault Header */}
              <div className="bg-white border-b border-[#e5e5e5] px-6 py-4">
                <div className="flex items-center gap-2 mb-4">
                  {vaultFolder && (
                    <>
                      <button
                        onClick={() => setVaultFolder(null)}
                        className="text-[#6b675f] hover:text-[#3d3d3d] text-sm"
                      >
                        Document Vault
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#6b675f]" />
                    </>
                  )}
                  <h2 className="text-lg font-semibold text-[#3d3d3d]">
                    {vaultFolder || "Document Vault"}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Search document vault"
                      className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#9b9b9b]"
                    />
                  </div>
                </div>
              </div>

              {/* Vault Content */}
              <div className="flex-1 overflow-auto p-6">
                {!vaultFolder ? (
                  // Root level folders
                  <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#f8f7f5] border-b border-[#e5e5e5]">
                        <tr>
                          <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Name</th>
                          <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Modified</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors cursor-pointer"
                          onClick={() => setVaultFolder("Customer Estates")}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                              <span className="text-[#3d3d3d] text-sm font-medium">Customer Estates</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6b675f] text-sm">Recently updated</td>
                        </tr>
                        <tr className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                              <span className="text-[#3d3d3d] text-sm font-medium">Probate Research</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6b675f] text-sm">Mon Nov 4 2024</td>
                        </tr>
                        <tr className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                              <span className="text-[#3d3d3d] text-sm font-medium">Settlement Processes</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6b675f] text-sm">Mon Nov 4 2024</td>
                        </tr>
                        <tr className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Trash2 className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                              <span className="text-[#3d3d3d] text-sm font-medium">Recently Deleted</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6b675f] text-sm">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : vaultFolder === "Customer Estates" ? (
                  // Customer Estates - Show all estates in folder format
                  <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#f8f7f5] border-b border-[#e5e5e5]">
                        <tr>
                          <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Name</th>
                          <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Size</th>
                          <th className="text-left px-6 py-3 text-[#3d3d3d] font-semibold text-sm">Modified</th>
                          <th className="text-right px-6 py-3 text-[#3d3d3d] font-semibold text-sm w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estates.map((estate) => (
                          <tr 
                            key={estate.id}
                            className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Folder className="w-5 h-5 text-[#6b675f] flex-shrink-0" />
                                <span 
                                  className="text-[#3d3d3d] text-sm font-medium cursor-pointer"
                                  onClick={() => setSelectedEstate(estate)}
                                >
                                  Estate of {estate.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#6b675f] text-sm">—</td>
                            <td className="px-6 py-4 text-[#6b675f] text-sm">{estate.createdAt} by {estate.assignedTo !== "None assigned" ? estate.assignedTo : "Alix"}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedEstate(estate)}
                                  className="p-1.5 text-[#6b675f] hover:bg-[#e5e5e5] rounded transition-colors"
                                  title="Edit estate"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1.5 text-[#6b675f] hover:bg-[#fee] hover:text-red-600 rounded transition-colors"
                                  title="Delete estate"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            // Original Estates List View
            <>
              {/* Filter Bar */}
          <div className="bg-white border-b border-[#e5e5e5] px-6 py-3">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Estate Search"
                className="w-64 h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#9b9b9b]"
              />
              <select className="h-9 px-3 py-1.5 bg-white border border-[#d0d0d0] rounded-md text-[#6b675f] text-sm">
                <option>Assigned To</option>
              </select>
              <select className="h-9 px-3 py-1.5 bg-white border border-[#d0d0d0] rounded-md text-[#6b675f] text-sm">
                <option>Status</option>
              </select>
              <label className="flex items-center gap-2 text-[#3d3d3d] text-[13px]">
                <input
                  type="checkbox"
                  checked={displayTestEstates}
                  onChange={(e) => setDisplayTestEstates(e.target.checked)}
                  className="rounded"
                />
                Display test estates
              </label>
              <Button variant="outline" className="border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] bg-white ml-auto text-sm h-9">
                <Download className="w-4 h-4 mr-1.5" />
                Export Financial Report
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
              <thead className="bg-[#ebe9e6] sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Estate ID</th>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Name</th>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Executors</th>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Status</th>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Type</th>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Created At</th>
                  <th className="text-left px-4 py-2.5 text-[#3d3d3d] font-medium text-[13px]">Assigned</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {estates.map((estate, index) => (
                  <tr 
                    key={estate.id} 
                    className="border-b border-[#f0f0f0] hover:bg-[#fafafa] cursor-pointer"
                    onClick={() => setSelectedEstate(estate)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-[#6b675f] text-[13px] underline hover:text-[#3d3d3d]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEstate(estate);
                          }}
                        >
                          {estate.shortId}
                        </button>
                        <button 
                          className="text-[#6b675f] hover:text-[#3d3d3d]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{estate.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {estate.executors.map((executor) => (
                          <span key={executor} className="px-2 py-0.5 bg-[#ebe9e6] text-[#3d3d3d] text-[12px] rounded">
                            {executor}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{estate.status}</td>
                    <td className="px-4 py-3">
                      <svg
                        className="w-4 h-4 text-[#3d3d3d]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </td>
                    <td className="px-4 py-3 text-[#3d3d3d] text-[13px]">{estate.createdAt}</td>
                    <td className="px-4 py-3 text-[#6b675f] text-[13px]">{estate.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
            </>
          )}
        </main>

        {/* Right Side Agent Text */}
        <div className="flex items-center justify-center bg-[#2d2d2d] px-2">
          <div className="writing-mode-vertical-rl rotate-180 text-white font-semibold tracking-widest text-sm">
            AI AGENT
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
              <h2 className="text-lg font-semibold text-[#3d3d3d]">Add Milestone</h2>
              <button
                onClick={() => {
                  setShowAddMilestoneModal(false)
                  setNewMilestoneName("")
                  setNewMilestoneDate("")
                  setNewMilestoneDescription("")
                  setNewMilestoneAssignedTo("")
                }}
                className="p-2 hover:bg-[#f8f7f5] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#6b675f]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                  Name <span className="text-red-600">*</span>
                </label>
                <select
                  value={newMilestoneName}
                  onChange={(e) => setNewMilestoneName(e.target.value)}
                  className="w-full h-9 px-3 py-1.5 text-sm bg-white border border-[#d0d0d0] rounded-md text-[#3d3d3d] focus:outline-none focus:ring-2 focus:ring-[#3d3d3d] focus:border-transparent"
                >
                  <option value="">Select a milestone...</option>
                  <option value="Closed WON">Closed WON</option>
                  <option value="K.Y.C.">K.Y.C.</option>
                  <option value="Determine Legal Path">Determine Legal Path</option>
                  <option value="File for Authority">File for Authority</option>
                  <option value="Initial Court Date">Initial Court Date</option>
                  <option value="Authority Granted">Authority Granted</option>
                  <option value="Establish Operating Bank Account">Establish Operating Bank Account</option>
                  <option value="File Distribution Order">File Distribution Order</option>
                  <option value="File Tax Return">File Tax Return</option>
                  <option value="File To Close">File To Close</option>
                  <option value="Estate Closed">Estate Closed</option>
                </select>
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                  Date <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={newMilestoneDate}
                  onChange={(e) => setNewMilestoneDate(e.target.value)}
                  className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d]"
                />
              </div>

              {/* Assigned To Field */}
              <div>
                <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                  Assigned To
                </label>
                <Input
                  type="text"
                  value={newMilestoneAssignedTo}
                  onChange={(e) => setNewMilestoneAssignedTo(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full h-9 text-sm bg-white border-[#d0d0d0] text-[#3d3d3d] placeholder:text-[#9b9b9b]"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-[#3d3d3d] mb-1.5">
                  Description
                </label>
                <textarea
                  value={newMilestoneDescription}
                  onChange={(e) => setNewMilestoneDescription(e.target.value)}
                  placeholder="Enter milestone details..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d0d0d0] rounded-md text-[#3d3d3d] placeholder:text-[#9b9b9b] focus:outline-none focus:ring-2 focus:ring-[#3d3d3d] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e5e5] bg-[#fafafa]">
              <Button
                onClick={() => {
                  setShowAddMilestoneModal(false)
                  setNewMilestoneName("")
                  setNewMilestoneDate("")
                  setNewMilestoneDescription("")
                  setNewMilestoneAssignedTo("")
                }}
                className="bg-white border border-[#d0d0d0] text-[#3d3d3d] hover:bg-[#f8f7f5] text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMilestone}
                className="bg-[#3d3d3d] text-white hover:bg-[#2d2d2d] text-sm h-9"
              >
                Save Milestone
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
