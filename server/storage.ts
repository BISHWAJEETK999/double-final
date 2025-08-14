import { type User, type InsertUser, type Destination, type InsertDestination, type Content, type InsertContent, type ContactSubmission, type InsertContactSubmission, type NewsletterSubscription, type InsertNewsletterSubscription, type Package, type InsertPackage, type GalleryImage, type InsertGalleryImage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, newPassword: string): Promise<User | undefined>;
  
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestinationsByType(type: 'domestic' | 'international'): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: string, destination: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: string): Promise<boolean>;
  
  // Content
  getContent(): Promise<Content[]>;
  getContentByKey(key: string): Promise<Content | undefined>;
  setContent(content: InsertContent): Promise<Content>;
  updateContent(key: string, value: string): Promise<Content | undefined>;
  
  // Contact Submissions
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined>;
  
  // Newsletter Subscriptions
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  
  // Packages
  getPackages(): Promise<Package[]>;
  getPackagesByDestination(destinationId: string): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(packageData: InsertPackage): Promise<Package>;
  updatePackage(id: string, packageData: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;
  
  // Gallery Images
  getGalleryImages(): Promise<GalleryImage[]>;
  getApprovedGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(imageData: InsertGalleryImage): Promise<GalleryImage>;
  approveGalleryImage(id: string): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private destinations: Map<string, Destination>;
  private content: Map<string, Content>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;
  private packages: Map<string, Package>;
  private galleryImages: Map<string, GalleryImage>;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.content = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
    this.packages = new Map();
    this.galleryImages = new Map();
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "Ttrave",
      createdAt: new Date()
    });

    // Initialize content
    const contentData = [
      { key: "site.name", value: "TTravel Hospitality" },
      { key: "hero.title", value: "Explore the World with TTRAVE" },
      { key: "hero.subtitle", value: "Book your next adventure with us!" },
      { key: "company.name", value: "TTravel Hospitality" },
      { key: "contact.phone", value: "+91 8100331032" },
      { key: "contact.email", value: "ttrave.travelagency@gmail.com" },
      { key: "contact.address", value: "B-12, Shop No. - 111/19, Saptaparni Market, Kalyani Central Park - ward no. 11, Nadia- 741235, West Bengal, India" },
      { key: "social.facebook", value: "#" },
      { key: "social.instagram", value: "#" },
      { key: "social.linkedin", value: "#" },
      { key: "social.twitter", value: "#" },
      { key: "inquiry.url", value: "https://forms.gle/your-inquiry-form-id" },
      { key: "inquiry.button.text", value: "Enquire Now" },
      { key: "about.hero.title", value: "About TTravel Hospitality" },
      { key: "about.hero.subtitle", value: "Your trusted partner for unforgettable travel experiences" },
      { key: "about.who.title", value: "Who We Are" },
      { key: "about.who.description1", value: "TTravel Hospitality is a premier travel agency dedicated to creating extraordinary travel experiences. With over a decade of expertise in the travel industry, we specialize in both domestic and international travel packages that cater to every traveler's dreams." },
      { key: "about.who.description2", value: "Our team of experienced travel consultants works tirelessly to ensure that every journey you take with us is seamless, memorable, and perfectly tailored to your preferences. From cultural expeditions to adventure tours, we have something special for everyone." },
      { key: "about.who.image", value: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
      { key: "about.values.title", value: "Our Core Values" },
      { key: "about.mission.title", value: "Our Mission" },
      { key: "about.mission.description", value: "To provide exceptional travel experiences that create lasting memories and foster cultural understanding through personalized service and attention to detail." },
      { key: "about.vision.title", value: "Our Vision" },
      { key: "about.vision.description", value: "To be the leading travel agency that connects people with the world's most beautiful destinations while promoting sustainable and responsible tourism practices." },
      { key: "about.values.description.title", value: "Our Values" },
      { key: "about.values.description", value: "Integrity, Excellence, Customer Focus, Innovation, and Sustainability guide every decision we make and every service we provide to our valued customers." },
    ];

    contentData.forEach(item => {
      const id = randomUUID();
      this.content.set(id, {
        id,
        key: item.key,
        value: item.value,
        createdAt: new Date()
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, password: newPassword };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(d => d.isActive);
  }

  async getDestinationsByType(type: 'domestic' | 'international'): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(d => d.type === type && d.isActive);
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = {
      ...insertDestination,
      id,
      icon: insertDestination.icon || "bi-geo-alt-fill",
      isActive: insertDestination.isActive ?? true,
      createdAt: new Date()
    };
    this.destinations.set(id, destination);
    return destination;
  }

  async updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    const destination = this.destinations.get(id);
    if (!destination) return undefined;
    
    const updatedDestination = { ...destination, ...updates };
    this.destinations.set(id, updatedDestination);
    return updatedDestination;
  }

  async deleteDestination(id: string): Promise<boolean> {
    const destination = this.destinations.get(id);
    if (!destination) return false;
    
    const updatedDestination = { ...destination, isActive: false };
    this.destinations.set(id, updatedDestination);
    return true;
  }

  // Content methods
  async getContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async getContentByKey(key: string): Promise<Content | undefined> {
    for (const content of this.content.values()) {
      if (content.key === key) {
        return content;
      }
    }
    return undefined;
  }

  async setContent(insertContent: InsertContent): Promise<Content> {
    const existing = await this.getContentByKey(insertContent.key);
    if (existing) {
      const updatedContent = { ...existing, value: insertContent.value };
      this.content.set(existing.id, updatedContent);
      return updatedContent;
    }
    
    const id = randomUUID();
    const content: Content = {
      ...insertContent,
      id,
      createdAt: new Date()
    };
    this.content.set(id, content);
    return content;
  }

  async updateContent(key: string, value: string): Promise<Content | undefined> {
    const existing = await this.getContentByKey(key);
    if (existing) {
      const updatedContent = { ...existing, value };
      this.content.set(existing.id, updatedContent);
      return updatedContent;
    }
    return undefined;
  }

  // Contact submission methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      status: insertSubmission.status || "new",
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined> {
    const submission = this.contactSubmissions.get(id);
    if (submission) {
      const updatedSubmission = { ...submission, status };
      this.contactSubmissions.set(id, updatedSubmission);
      return updatedSubmission;
    }
    return undefined;
  }

  // Newsletter subscription methods
  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values());
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const existing = Array.from(this.newsletterSubscriptions.values()).find(s => s.email === insertSubscription.email);
    if (existing) {
      if (!existing.isActive) {
        const reactivated = { ...existing, isActive: true };
        this.newsletterSubscriptions.set(existing.id, reactivated);
        return reactivated;
      }
      return existing;
    }

    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      isActive: true,
      createdAt: new Date()
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  // Package methods
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(p => p.isActive);
  }

  async getPackagesByDestination(destinationId: string): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(p => p.destinationId === destinationId && p.isActive);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const packageData: Package = {
      ...insertPackage,
      id,
      isFeatured: insertPackage.isFeatured ?? false,
      isActive: insertPackage.isActive ?? true,
      createdAt: new Date()
    };
    this.packages.set(id, packageData);
    return packageData;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    const packageData = this.packages.get(id);
    if (!packageData) return undefined;
    
    const updatedPackage = { ...packageData, ...updates };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: string): Promise<boolean> {
    const packageData = this.packages.get(id);
    if (!packageData) return false;
    
    const updatedPackage = { ...packageData, isActive: false };
    this.packages.set(id, updatedPackage);
    return true;
  }

  // Gallery Image methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getApprovedGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).filter(img => img.isApproved);
  }

  async createGalleryImage(imageData: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const galleryImage: GalleryImage = {
      ...imageData,
      id,
      isApproved: false,
      createdAt: new Date()
    };
    this.galleryImages.set(id, galleryImage);
    return galleryImage;
  }

  async approveGalleryImage(id: string): Promise<GalleryImage | undefined> {
    const galleryImage = this.galleryImages.get(id);
    if (galleryImage) {
      const updatedImage = { ...galleryImage, isApproved: true };
      this.galleryImages.set(id, updatedImage);
      return updatedImage;
    }
    return undefined;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const deleted = this.galleryImages.delete(id);
    return deleted;
  }
}

// Create storage instance based on environment
function createStorage(): IStorage {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    console.log("✅ Using PostgreSQL database - your changes will be permanent!");
    // For now, return MemStorage until database integration is complete
    return new MemStorage();
  } else {
    console.log("⚠️ Using temporary memory storage - changes will be lost on restart!");
    console.log("💡 Add DATABASE_URL to Render environment variables for permanent storage");
    return new MemStorage();
  }
}

// Export storage instance
export const storage = createStorage();